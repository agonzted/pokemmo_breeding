// ========================================
// PokeMMO Breeding Engine
// Generates breeding trees following PokeMMO mechanics
// ========================================

/**
 * Breeding Tree Structure:
 * For N desired IVs, we need a binary tree where:
 * - Leaves = base Pokemon (1x31 IV each), total = 2^N (without nature) or 2^N (with nature integrated)
 * - Each pair breeds to form a parent with 2x31
 * - Pairs of 2x31 breed to form 3x31, etc.
 * - Nature is introduced via Everstone on the last breeding step
 *
 * PokeMMO Breeding Rules:
 * 1. Each parent can hold 1 Power Item to guarantee 1 IV passes
 * 2. Max 2 guaranteed IVs per breed (one from each parent via Power Items)
 * 3. If both parents share a 31 IV in the same stat, offspring inherits it (overlap rule)
 * 4. Everstone on a parent passes its nature 100%
 * 5. Both parents are consumed
 */

class BreedingPlanner {
    constructor(pokemonName, pokemonId, desiredIVs, nature, ivConfig) {
        this.pokemonName = pokemonName;
        this.pokemonId = pokemonId;
        this.desiredIVs = desiredIVs; // array of stat keys like ['hp', 'atk', 'def', 'spa', 'spe']
        this.nature = nature; // nature object or null
        this.ivConfig = ivConfig || {}; // map of stat -> desired IV value (default 31)
        this.nodeId = 0;
    }

    /**
     * Generate the complete breeding plan
     */
    generatePlan() {
        const numIVs = this.desiredIVs.length;
        
        if (numIVs === 0) return null;

        // Build the breeding tree
        const tree = this.buildTree(this.desiredIVs, this.nature);
        
        // Generate step-by-step instructions
        const steps = this.generateSteps(tree);
        
        // Calculate requirements
        const requirements = this.calculateRequirements(tree);

        return {
            tree,
            steps,
            requirements,
            pokemonName: this.pokemonName,
            pokemonId: this.pokemonId,
            desiredIVs: this.desiredIVs,
            nature: this.nature,
            totalParents: requirements.totalPokemon,
            totalBreedings: requirements.totalBreedings
        };
    }

    /**
     * Build the breeding tree recursively
     * For N IVs: we need 2^(N-1) * 2 base pokemon = 2^N leaves
     * With nature: the nature parent replaces one of the final parents or is added
     */
    buildTree(ivs, nature) {
        const n = ivs.length;
        
        if (n === 0) {
            return this.createLeafNode([], null);
        }

        if (n === 1) {
            // Single IV: just need one pokemon with that IV (+ nature if desired)
            if (nature) {
                // Need to breed: one parent with the IV + power item, one with nature + everstone
                return this.createBreedNode(
                    this.createLeafNode([ivs[0]], ivs[0]),
                    this.createNatureLeaf(nature),
                    ivs,
                    [{ stat: ivs[0], holder: 'parent1' }],
                    'everstone_parent2'
                );
            }
            return this.createLeafNode(ivs, ivs[0]);
        }

        if (nature) {
            // With nature: build IV tree for all IVs, then breed with nature parent
            // The IV tree produces a pokemon with all desired IVs
            // Then we breed it with a natured pokemon that shares (n-1) IVs for overlap
            // Actually in PokeMMO the standard approach:
            // Build the full IV binary tree, on the last step one parent holds everstone
            return this.buildTreeWithNature(ivs, nature);
        }

        // Without nature: pure binary IV tree
        return this.buildIVTree(ivs);
    }

    /**
     * Build pure IV tree (no nature)
     * Strategy: split IVs into two halves, recursively build sub-trees,
     * then combine them with power items for the new IVs and overlap for shared IVs
     */
    buildIVTree(ivs) {
        if (ivs.length === 1) {
            return this.createLeafNode([ivs[0]], ivs[0]);
        }

        if (ivs.length === 2) {
            // Base case: two 1x31 parents each with a power item
            const parent1 = this.createLeafNode([ivs[0]], ivs[0]);
            const parent2 = this.createLeafNode([ivs[1]], ivs[1]);
            return this.createBreedNode(parent1, parent2, ivs,
                [{ stat: ivs[0], holder: 'parent1' }, { stat: ivs[1], holder: 'parent2' }],
                null
            );
        }

        // Split: parent1 gets half the IVs, parent2 gets the other half
        // They share overlap IVs to maximize efficiency
        // Standard PokeMMO approach:
        // To go from Nx31 to (N+1)x31:
        // Parent1 = Nx31 pokemon
        // Parent2 = pokemon with (N-1) overlapping IVs + 1 new IV
        // Power items used: one for a non-overlapping IV on each parent
        
        // For building from scratch, we use balanced binary tree approach:
        const mid = Math.ceil(ivs.length / 2);
        const leftIVs = ivs.slice(0, mid);
        const rightIVs = ivs.slice(mid);

        const parent1 = this.buildIVTree(leftIVs);
        const parent2 = this.buildIVTree(rightIVs);

        // Determine power items needed:
        // Each parent introduces new IVs. We need power items for the IVs that don't overlap
        // Since left and right don't share IVs, we pick one from each side for power items
        const items = [];
        
        // Parent1 holds power item for one of its unique IVs (the one not shared by parent2)
        // In a balanced split, none overlap, so we pick the "new" IV from each side
        // Actually we need to think about this differently for the overlap rule
        
        // In PokeMMO: when combining, overlapping IVs pass automatically
        // Non-overlapping IVs need power items (max 2, one per parent)
        // So for a clean split where no IVs overlap between parents,
        // we can only guarantee 2 new IVs per breeding (one from each power item)
        // The rest must come from overlap
        
        // This means a balanced binary tree works:
        // Level 0 (leaves): 1x31 each
        // Level 1: combine pairs -> 2x31 each (2 power items)
        // Level 2: combine 2x31 pairs -> they share 0-1 IVs...
        
        // Better approach: linear chain
        // Start with 2x31, then add 1 IV at a time:
        // 2x31 + 2x31(with 1 overlap) -> 3x31
        // 3x31 + 3x31(with 2 overlap) -> 4x31
        // etc.
        
        // But this still needs the same total base pokemon
        // Let me use the standard PokeMMO community approach:
        
        // For N IVs, the tree has N levels
        // Bottom level has 2^(N-1) pairs = 2^N leaves
        // Each level l: parent1 has IVs from left subtree
        //               parent2 has IVs from right subtree
        //               They share some IVs (overlap) and each introduces 1 new via power item
        
        // Actually the simplest correct approach:
        // Build the balanced tree, and at each merge:
        // - parent1 contributes its IVs
        // - parent2 contributes its IVs
        // - Overlapping IVs pass automatically
        // - 2 power items handle 2 non-overlapping IVs (one per parent)
        // - For this to work, each parent must contribute AT MOST 1 new non-overlapping IV
        // - The rest must overlap
        
        // This means at each merge, combined IVs = overlap + 2 new = overlap + 2
        // For balanced tree: parent1 has ceil(n/2) IVs, parent2 has floor(n/2) IVs
        // overlap = ceil(n/2) + floor(n/2) - n = 0
        // combined = 0 + 2 = 2... that's wrong for n > 2
        
        // The correct PokeMMO approach uses a DIFFERENT tree structure:
        // It's NOT balanced. It follows this pattern:
        // For 5x31: you need pairs that share progressively more IVs

        // Let me implement the CORRECT PokeMMO breeding tree:
        return this.buildCorrectIVTree(ivs);
    }

    /**
     * PokeMMO-Hub Community Standard Breeding Table
     * 
     * This lookup table defines exactly which IVs each pokemon at each position
     * in the tree needs. It matches the breedingTable.json from pokemmohub.com.
     * 
     * Index 0 = nature, Indices 1-5 = IV stats (mapped to desiredIVs array)
     * 
     * For N IVs (random mode, no nature):
     *   Row 1 = base pokemon (leaves), each with 1 IV
     *   Row K = bred pokemon with K IVs
     *   Row N = final result with all N IVs
     *
     * Key pattern (sliding window):
     *   5 IVs leaves: [1,2,1,3,2,3,2,4,2,3,2,4,3,4,3,5]
     *   This distributes IVs more evenly than a recursive left-heavy approach.
     */
    static BREEDING_TABLE = {
        random: {
            iv5: {
                1: [[1],[2],[1],[3],[2],[3],[2],[4],[2],[3],[2],[4],[3],[4],[3],[5]],
                2: [[1,2],[1,3],[2,3],[2,4],[2,3],[2,4],[3,4],[3,5]],
                3: [[1,2,3],[2,3,4],[2,3,4],[3,4,5]],
                4: [[1,2,3,4],[2,3,4,5]],
                5: [[1,2,3,4,5]]
            },
            iv4: {
                1: [[1],[2],[1],[3],[2],[3],[2],[4]],
                2: [[1,2],[1,3],[2,3],[2,4]],
                3: [[1,2,3],[2,3,4]],
                4: [[1,2,3,4]]
            },
            iv3: {
                1: [[1],[2],[1],[3]],
                2: [[1,2],[1,3]],
                3: [[1,2,3]]
            },
            iv2: {
                1: [[1],[2]],
                2: [[1,2]]
            },
            iv6: {
                1: [[1],[2],[1],[3],[2],[3],[2],[4],[2],[3],[2],[4],[3],[4],[3],[5],[2],[3],[2],[4],[3],[4],[3],[5],[3],[4],[3],[5],[4],[5],[4],[6]],
                2: [[1,2],[1,3],[2,3],[2,4],[2,3],[2,4],[3,4],[3,5],[2,3],[2,4],[3,4],[3,5],[3,4],[3,5],[4,5],[4,6]],
                3: [[1,2,3],[2,3,4],[2,3,4],[3,4,5],[2,3,4],[3,4,5],[3,4,5],[4,5,6]],
                4: [[1,2,3,4],[2,3,4,5],[2,3,4,5],[3,4,5,6]],
                5: [[1,2,3,4,5],[2,3,4,5,6]],
                6: [[1,2,3,4,5,6]]
            }
        },
        nature: {
            iv5: {
                1: [[1],[2],[1],[3],[2],[3],[2],[4],[2],[3],[2],[4],[3],[4],[3],[5],[0],[2],[2],[3],[2],[3],[2],[4],[2],[3],[2],[4],[3],[4],[3],[5]],
                2: [[1,2],[1,3],[2,3],[2,4],[2,3],[2,4],[3,4],[3,5],[0,2],[2,3],[2,3],[2,4],[2,3],[2,4],[3,4],[3,5]],
                3: [[1,2,3],[2,3,4],[2,3,4],[3,4,5],[0,2,3],[2,3,4],[2,3,4],[3,4,5]],
                4: [[1,2,3,4],[2,3,4,5],[0,2,3,4],[2,3,4,5]],
                5: [[1,2,3,4,5],[0,2,3,4,5]],
                6: [[1,2,3,4,5,0]]
            },
            iv4: {
                1: [[0],[1],[1],[2],[1],[2],[1],[3],[1],[2],[1],[3],[2],[3],[2],[4]],
                2: [[0,1],[1,2],[1,2],[1,3],[1,2],[1,3],[2,3],[2,4]],
                3: [[0,1,2],[1,2,3],[1,2,3],[2,3,4]],
                4: [[0,1,2,3],[1,2,3,4]],
                5: [[0,1,2,3,4]]
            },
            iv3: {
                1: [[0],[1],[1],[2],[1],[2],[1],[3]],
                2: [[0,1],[1,2],[1,2],[1,3]],
                3: [[0,1,2],[1,2,3]],
                4: [[0,1,2,3]]
            },
            iv2: {
                1: [[0],[1],[1],[2]],
                2: [[0,1],[1,2]],
                3: [[0,1,2]]
            },
            iv1: {
                1: [[0],[1]],
                2: [[0,1]]
            },
            iv6: {
                1: [[1],[2],[1],[3],[2],[3],[2],[4],[2],[3],[2],[4],[3],[4],[3],[5],[2],[3],[2],[4],[3],[4],[3],[5],[3],[4],[3],[5],[4],[5],[4],[6],[2],[3],[2],[4],[3],[4],[3],[5],[3],[4],[3],[5],[4],[5],[4],[6],[0],[3],[3],[4],[3],[4],[3],[5],[3],[4],[3],[5],[4],[5],[4],[6]],
                2: [[1,2],[1,3],[2,3],[2,4],[2,3],[2,4],[3,4],[3,5],[2,3],[2,4],[3,4],[3,5],[3,4],[3,5],[4,5],[4,6],[2,3],[2,4],[3,4],[3,5],[3,4],[3,5],[4,5],[4,6],[0,3],[3,4],[3,4],[3,5],[3,4],[3,5],[4,5],[4,6]],
                3: [[1,2,3],[2,3,4],[2,3,4],[3,4,5],[2,3,4],[3,4,5],[3,4,5],[4,5,6],[2,3,4],[3,4,5],[3,4,5],[4,5,6],[0,3,4],[3,4,5],[3,4,5],[4,5,6]],
                4: [[1,2,3,4],[2,3,4,5],[2,3,4,5],[3,4,5,6],[2,3,4,5],[3,4,5,6],[0,3,4,5],[3,4,5,6]],
                5: [[1,2,3,4,5],[2,3,4,5,6],[2,3,4,5,6],[0,3,4,5,6]],
                6: [[1,2,3,4,5,6],[2,3,4,5,6,0]],
                7: [[1,2,3,4,5,6,0]]
            }
        }
    };

    /**
     * Build the breeding tree using the community-standard lookup table.
     * This matches pokemmohub.com's breedingTable.json exactly.
     */
    buildCorrectIVTree(ivs) {
        const n = ivs.length;
        const tableKey = `iv${n}`;
        const table = BreedingPlanner.BREEDING_TABLE.random[tableKey];
        
        if (!table) {
            // Fallback for 1 IV
            return this.createLeafNode([ivs[0]], ivs[0]);
        }

        return this._buildFromTable(table, ivs, null);
    }

    /**
     * Build tree from the lookup table rows.
     * Maps index 1..N to actual IV stat names from the ivs array.
     */
    _buildFromTable(table, ivs, nature) {
        const rows = Object.keys(table).map(Number).sort((a, b) => a - b);
        const totalRows = rows.length;
        
        // Build level by level, bottom-up
        // Row 1 = leaves, each subsequent row = bred results
        let currentLevel = [];

        // Create leaf nodes (row 1)
        const leafRow = table[rows[0]];
        leafRow.forEach(ivIndices => {
            const mappedIVs = [];
            let isNatureOnly = false;
            let powerItemStat = null;

            ivIndices.forEach(idx => {
                if (idx === 0) {
                    isNatureOnly = true; // nature slot
                } else {
                    mappedIVs.push(ivs[idx - 1]); // map 1-based index to actual stat
                }
            });

            if (isNatureOnly && mappedIVs.length === 0) {
                // Pure nature leaf
                currentLevel.push(this.createNatureLeaf(nature));
            } else if (isNatureOnly && mappedIVs.length > 0) {
                // Leaf with IVs + nature (shouldn't happen in row 1 for nature mode,
                // but handle for safety)
                powerItemStat = mappedIVs[mappedIVs.length - 1];
                const node = this.createLeafNode(mappedIVs, powerItemStat);
                node.nature = nature;
                node.heldItem = 'Everstone';
                currentLevel.push(node);
            } else {
                powerItemStat = mappedIVs[mappedIVs.length - 1]; // power item for the last IV
                currentLevel.push(this.createLeafNode(mappedIVs, powerItemStat));
            }
        });

        // Build bred nodes, row by row
        for (let r = 1; r < totalRows; r++) {
            const nextRow = table[rows[r]];
            const nextLevel = [];

            for (let i = 0; i < nextRow.length; i++) {
                const p1 = currentLevel[i * 2];
                const p2 = currentLevel[i * 2 + 1];
                const ivIndices = nextRow[i];

                const mappedIVs = [];
                let hasNature = false;

                ivIndices.forEach(idx => {
                    if (idx === 0) {
                        hasNature = true;
                    } else {
                        mappedIVs.push(ivs[idx - 1]);
                    }
                });

                // Determine power items: find IVs unique to each parent
                const p1IVSet = new Set(p1.ivs || []);
                const p2IVSet = new Set(p2.ivs || []);
                const p1Unique = mappedIVs.filter(iv => !p2IVSet.has(iv) && p1IVSet.has(iv));
                const p2Unique = mappedIVs.filter(iv => !p1IVSet.has(iv) && p2IVSet.has(iv));

                const powerItems = [];
                // Determine which parent actually carries nature
                const p1HasNature = p1.isNatureParent || p1.inheritedNature || p1.nature;
                const p2HasNature = p2.isNatureParent || p2.inheritedNature || p2.nature;
                let everstoneHolder = null;

                if (hasNature && (p1HasNature || p2HasNature)) {
                    // Determine which parent holds the Everstone
                    if (p1HasNature) {
                        everstoneHolder = 'everstone_parent1';
                        // Parent1 holds Everstone → parent2 can hold a power item
                        if (p2Unique.length > 0) {
                            powerItems.push({ stat: p2Unique[0], holder: 'parent2' });
                        } else {
                            // Find any IV that parent2 uniquely contributes
                            const p2ContribStat = mappedIVs.find(iv => p2IVSet.has(iv) && !p1IVSet.has(iv));
                            if (p2ContribStat) {
                                powerItems.push({ stat: p2ContribStat, holder: 'parent2' });
                            } else if (mappedIVs.length > 0) {
                                // Both parents share IVs, pick one for parent2
                                powerItems.push({ stat: mappedIVs[0], holder: 'parent2' });
                            }
                        }
                    } else {
                        everstoneHolder = 'everstone_parent2';
                        // Parent2 holds Everstone → parent1 can hold a power item
                        if (p1Unique.length > 0) {
                            powerItems.push({ stat: p1Unique[0], holder: 'parent1' });
                        } else {
                            const p1ContribStat = mappedIVs.find(iv => p1IVSet.has(iv) && !p2IVSet.has(iv));
                            if (p1ContribStat) {
                                powerItems.push({ stat: p1ContribStat, holder: 'parent1' });
                            } else if (mappedIVs.length > 0) {
                                powerItems.push({ stat: mappedIVs[0], holder: 'parent1' });
                            }
                        }
                    }
                } else {
                    // Both can hold power items
                    if (p1Unique.length > 0) {
                        powerItems.push({ stat: p1Unique[0], holder: 'parent1' });
                    }
                    if (p2Unique.length > 0) {
                        powerItems.push({ stat: p2Unique[0], holder: 'parent2' });
                    }
                    // If no unique found, pick from mapped IVs
                    if (powerItems.length === 0 && mappedIVs.length >= 2) {
                        powerItems.push({ stat: mappedIVs[0], holder: 'parent1' });
                        powerItems.push({ stat: mappedIVs[1], holder: 'parent2' });
                    }
                }

                const breedNode = this.createBreedNode(p1, p2, mappedIVs, powerItems, everstoneHolder);
                if (hasNature && nature) {
                    breedNode.nature = nature;
                    breedNode.inheritedNature = nature;
                }
                nextLevel.push(breedNode);
            }

            currentLevel = nextLevel;
        }

        return currentLevel[0];
    }

    /**
     * Build tree with nature integrated using the community-standard lookup table.
     * Uses BREEDING_TABLE.nature which has the exact same structure as pokemmohub.com.
     * For N IVs + nature: tree has N+1 levels, 2^N base pokemon.
     */
    buildTreeWithNature(ivs, nature) {
        const n = ivs.length;
        const tableKey = `iv${n}`;
        const table = BreedingPlanner.BREEDING_TABLE.nature[tableKey];
        
        if (!table) {
            // Fallback for edge cases
            if (n === 0) {
                return this.createNatureLeaf(nature);
            }
            const p1 = this.createLeafNode([ivs[0]], ivs[0]);
            const p2 = this.createNatureLeaf(nature);
            return this.createBreedNode(p1, p2, ivs,
                [{ stat: ivs[0], holder: 'parent1' }],
                'everstone_parent2'
            );
        }

        return this._buildFromTable(table, ivs, nature);
    }

    createLeafNode(ivs, powerItemStat) {
        this.nodeId++;
        // Compute ivValues map for this leaf
        const ivValues = {};
        ivs.forEach(iv => {
            ivValues[iv] = this.ivConfig[iv] !== undefined ? this.ivConfig[iv] : 31;
        });
        return {
            id: this.nodeId,
            type: 'leaf',
            ivs: ivs,
            ivValues: ivValues,
            powerItem: powerItemStat ? POWER_ITEMS[powerItemStat] : null,
            powerItemStat: powerItemStat,
            gender: null, // assigned later
            nature: null,
            isNatureParent: false,
            children: []
        };
    }

    createNatureLeaf(nature) {
        this.nodeId++;
        return {
            id: this.nodeId,
            type: 'nature_leaf',
            ivs: [],
            powerItem: null,
            powerItemStat: null,
            gender: null,
            nature: nature,
            isNatureParent: true,
            heldItem: 'Everstone',
            children: []
        };
    }

    createBreedNode(parent1, parent2, resultIVs, powerItems, everstoneHolder) {
        this.nodeId++;
        
        // Assign genders: parent1 = male, parent2 = female (standard)
        parent1.gender = '♂';
        parent2.gender = '♀';

        // Compute ivValues for the result
        const ivValues = {};
        resultIVs.forEach(iv => {
            ivValues[iv] = this.ivConfig[iv] !== undefined ? this.ivConfig[iv] : 31;
        });

        // Determine which parent passes nature based on who holds the Everstone
        let inheritedNature = null;
        if (everstoneHolder === 'everstone_parent1') {
            inheritedNature = parent1.nature || parent1.inheritedNature;
        } else if (everstoneHolder === 'everstone_parent2') {
            inheritedNature = parent2.nature || parent2.inheritedNature;
        }

        return {
            id: this.nodeId,
            type: 'breed',
            ivs: resultIVs,
            ivValues: ivValues,
            powerItems: powerItems,
            everstoneHolder: everstoneHolder,
            gender: null,
            nature: inheritedNature,
            inheritedNature: inheritedNature,
            children: [parent1, parent2]
        };
    }

    /**
     * Traverse tree and assign alternating genders properly
     */
    assignGenders(node, targetGender) {
        if (!node) return;
        
        if (node.type === 'breed') {
            // This node's result needs a gender if it's used as a parent later
            node.gender = targetGender || null;
            
            // Children: one male, one female
            if (node.children[0]) {
                node.children[0].gender = '♂';
                this.assignGenders(node.children[0], '♂');
            }
            if (node.children[1]) {
                node.children[1].gender = '♀';
                this.assignGenders(node.children[1], '♀');
            }
        }
    }

    /**
     * Count all leaves (base pokemon needed)
     */
    countLeaves(node) {
        if (!node) return 0;
        if (node.type === 'leaf' || node.type === 'nature_leaf' || node.type === 'existing') return 1;
        return node.children.reduce((sum, child) => sum + this.countLeaves(child), 0);
    }

    /**
     * Count all breeding operations
     */
    countBreedings(node) {
        if (!node) return 0;
        if (node.type === 'leaf' || node.type === 'nature_leaf' || node.type === 'existing') return 0;
        return 1 + node.children.reduce((sum, child) => sum + this.countBreedings(child), 0);
    }

    /**
     * Collect all leaf nodes
     */
    collectLeaves(node, leaves = []) {
        if (!node) return leaves;
        if (node.type === 'leaf' || node.type === 'nature_leaf' || node.type === 'existing') {
            leaves.push(node);
            return leaves;
        }
        node.children.forEach(child => this.collectLeaves(child, leaves));
        return leaves;
    }

    /**
     * Generate step-by-step breeding instructions
     */
    generateSteps(tree) {
        const steps = [];
        this.generateStepsRecursive(tree, steps, 0);
        // Number steps
        steps.forEach((step, i) => step.number = i + 1);
        return steps;
    }

    generateStepsRecursive(node, steps, depth) {
        if (!node || node.type === 'leaf' || node.type === 'nature_leaf' || node.type === 'existing') return;

        // Process children first (bottom-up)
        node.children.forEach(child => this.generateStepsRecursive(child, steps, depth + 1));

        const parent1 = node.children[0];
        const parent2 = node.children[1];
        const pokeName = this.pokemonName || 'Pokémon';

        const p1IVNames = (parent1.ivs || []).map(iv => STAT_NAMES[iv]).join(', ');
        const p2IVNames = (parent2.ivs || []).map(iv => STAT_NAMES[iv]).join(', ');
        const resultIVNames = node.ivs.map(iv => STAT_NAMES[iv]).join(', ');

        // Determine the species label for each parent
        // Leaf = base pokemon you need to catch/buy (Garchomp / Ditto)
        // Breed = intermediate result from a previous step (Garchomp criado)
        // Nature leaf = pokemon with specific nature
        const getParentLabel = (parent, gender) => {
            if (parent.isNatureParent) {
                return `${pokeName} / Ditto con naturaleza ${parent.nature.name} (${parent.nature.nameEs}) — Piedra Eterna`;
            }
            const ivCount = parent.ivs.length;
            const ivNames = parent.ivs.map(iv => STAT_NAMES[iv]).join(', ');
            if (parent.type === 'existing') {
                // Existing pokemon the user already has
                const ivCount = parent.ivs.length;
                const ivNames = parent.ivs.map(iv => STAT_NAMES[iv]).join(', ');
                return `⭐ TU ${pokeName} existente ${gender} con ${ivCount}x31 (${ivNames})`;
            }
            if (parent.type === 'leaf') {
                // Base pokemon: could be the target species or a Ditto
                return `${pokeName} / Ditto ${gender} con ${ivCount}x31 (${ivNames})`;
            } else {
                // Bred result from a previous step
                return `${pokeName} criado ${gender} con ${ivCount}x31 (${ivNames})`;
            }
        };

        let p1Desc = getParentLabel(parent1, parent1.gender);
        let p2Desc = getParentLabel(parent2, parent2.gender);

        const items = [];
        if (node.powerItems) {
            node.powerItems.forEach(pi => {
                const item = POWER_ITEMS[pi.stat];
                const holder = pi.holder === 'parent1' ? 'Padre 1' : 'Padre 2';
                items.push({ type: 'power-item', name: `${item.emoji} ${item.name}`, detail: `en ${holder} → hereda ${STAT_NAMES[pi.stat]}` });
            });
        }
        if (node.everstoneHolder) {
            const evHolder = node.everstoneHolder === 'everstone_parent1' ? 'Padre 1' : 'Padre 2';
            items.push({ type: 'everstone', name: '💎 Piedra Eterna', detail: `en ${evHolder} → hereda naturaleza` });
        }

        const hasNature = node.everstoneHolder && node.inheritedNature;
        let resultDesc = `${node.ivs.length}x31 (${resultIVNames})`;
        if (hasNature) {
            resultDesc += ` + Naturaleza ${node.inheritedNature.name}`;
        }

        steps.push({
            parent1Desc: p1Desc,
            parent2Desc: p2Desc,
            resultDesc: resultDesc,
            resultGender: node.gender,
            items: items,
            resultIVs: node.ivs.length,
            isLastStep: depth === 0,
            nodeId: node.id,
            parent1Id: parent1.id,
            parent2Id: parent2.id
        });
    }

    /**
     * Calculate total requirements
     */
    calculateRequirements(tree) {
        const leaves = this.collectLeaves(tree);
        const totalBreedings = this.countBreedings(tree);
        
        // Count power items needed
        const powerItemCounts = {};
        this.collectPowerItems(tree, powerItemCounts);
        
        // Count how many breeding steps use an Everstone
        const everstoneCount = this.countEverstones(tree);

        return {
            totalPokemon: leaves.length,
            totalBreedings: totalBreedings,
            leaves: leaves,
            powerItemCounts: powerItemCounts,
            needsEverstone: everstoneCount > 0,
            everstoneCount: everstoneCount
        };
    }

    countEverstones(node) {
        if (!node) return 0;
        let count = 0;
        if (node.everstoneHolder) count++;
        if (node.children) {
            node.children.forEach(child => count += this.countEverstones(child));
        }
        return count;
    }

    collectPowerItems(node, counts) {
        if (!node) return;
        if (node.powerItems) {
            node.powerItems.forEach(pi => {
                const itemName = POWER_ITEMS[pi.stat].name;
                counts[itemName] = (counts[itemName] || 0) + 1;
            });
        }
        if (node.children) {
            node.children.forEach(child => this.collectPowerItems(child, counts));
        }
    }

    /**
     * Optimize the tree by replacing a subtree with an existing Pokemon.
     * The existing Pokemon's 31 IVs can replace the largest subtree 
     * whose IVs are a subset of the existing Pokemon's 31s.
     * 
     * @param {Object} tree - the breeding tree root
     * @param {Object} existingPokemon - { ivs: {hp: 31, atk: 31, ...}, nature: {...}, gender: '♂' }
     * @returns {Object} modified tree
     */
    optimizeWithExisting(tree, existingPokemon) {
        if (!existingPokemon) return tree;

        // Get the set of stats where existing pokemon has the desired IV value
        const existing31Stats = new Set();
        for (const stat of this.desiredIVs) {
            const existVal = existingPokemon.ivs[stat];
            const desiredVal = this.ivConfig[stat] !== undefined ? this.ivConfig[stat] : 31;
            if (existVal === desiredVal) {
                existing31Stats.add(stat);
            }
        }

        if (existing31Stats.size === 0) return tree; // No matching IVs

        // Walk the tree and find the best node to replace
        // Best = highest number of IVs that are all within existing31Stats
        let bestNode = null;
        let bestNodeParent = null;
        let bestNodeIndex = -1;
        let bestScore = 0;

        const walk = (node, parent, childIndex) => {
            if (!node) return;
            if (node.type === 'leaf' || node.type === 'nature_leaf' || node.type === 'existing') return;

            // Check if ALL of this node's IVs are in the existing pokemon's 31 stats
            const nodeIVs = node.ivs || [];
            const allMatch = nodeIVs.every(iv => existing31Stats.has(iv));
            
            if (allMatch && nodeIVs.length > bestScore) {
                bestScore = nodeIVs.length;
                bestNode = node;
                bestNodeParent = parent;
                bestNodeIndex = childIndex;
            }

            // Also check children for potentially better matches
            if (node.children) {
                node.children.forEach((child, idx) => walk(child, node, idx));
            }
        };

        // Check if the root itself can be replaced (existing pokemon already has all IVs)
        const rootIVs = tree.ivs || [];
        const rootAllMatch = rootIVs.every(iv => existing31Stats.has(iv));
        if (rootAllMatch && !tree.everstoneHolder) {
            // The existing pokemon already has all desired IVs, 
            // but we might still need nature change
            // Only replace if no nature is needed or existing nature matches
            if (!this.nature || (existingPokemon.nature && existingPokemon.nature.name === this.nature.name)) {
                // Nothing to breed! The existing pokemon already matches
                return this._createExistingNode(existingPokemon, rootIVs);
            }
        }

        // Walk children (not root - root can't be replaced without handling nature)
        if (tree.children) {
            tree.children.forEach((child, idx) => walk(child, tree, idx));
        }

        if (bestNode && bestNodeParent && bestScore >= 1) {
            // Replace this subtree with an existing pokemon node
            const existingNode = this._createExistingNode(existingPokemon, bestNode.ivs);
            existingNode.gender = bestNode.gender;
            
            // Check if nature should carry over
            if (bestNode.nature || bestNode.inheritedNature) {
                if (existingPokemon.nature && this.nature && 
                    existingPokemon.nature.name === this.nature.name) {
                    existingNode.nature = existingPokemon.nature;
                    existingNode.inheritedNature = existingPokemon.nature;
                }
            }

            bestNodeParent.children[bestNodeIndex] = existingNode;
        }

        return tree;
    }

    /**
     * Create a node representing an existing pokemon the user already has
     */
    _createExistingNode(existingPokemon, ivs) {
        this.nodeId++;
        const ivValues = {};
        ivs.forEach(iv => {
            ivValues[iv] = this.ivConfig[iv] !== undefined ? this.ivConfig[iv] : 31;
        });
        return {
            id: this.nodeId,
            type: 'existing',
            ivs: ivs,
            ivValues: ivValues,
            powerItem: null,
            powerItemStat: null,
            gender: existingPokemon.gender || '♂',
            nature: existingPokemon.nature || null,
            inheritedNature: existingPokemon.nature || null,
            isNatureParent: false,
            isExisting: true,
            children: []
        };
    }
}

// ========================================
// Tree Renderer - Draws the breeding tree on Canvas
// ========================================
class TreeRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 1;
        this.nodeWidth = 160;
        this.nodeHeight = 80;
        this.horizontalSpacing = 20;
        this.verticalSpacing = 60;
        this.padding = 40;
    }

    render(tree, pokemonName, highlightedNodeIds = null) {
        if (!tree) return;

        // Store for re-rendering
        this._tree = tree;
        this._pokemonName = pokemonName;

        // Calculate tree dimensions
        const dimensions = this.calculateDimensions(tree, 0);
        
        const canvasWidth = (dimensions.width + this.padding * 2) * this.scale;
        const canvasHeight = (dimensions.height + this.padding * 2) * this.scale;
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        this.ctx.scale(this.scale, this.scale);
        
        // Clear
        this.ctx.fillStyle = 'rgba(15, 15, 26, 0.95)';
        this.ctx.fillRect(0, 0, canvasWidth / this.scale, canvasHeight / this.scale);
        
        // Calculate positions (top-down: root at top)
        this._positions = {};
        this.calculatePositions(tree, this.padding, this.padding, dimensions.width, this._positions);
        
        // Draw connections (dim non-highlighted when highlighting)
        this.drawConnections(tree, this._positions, highlightedNodeIds);
        
        // Draw nodes
        this.drawNodes(tree, this._positions, pokemonName, highlightedNodeIds);

        // Draw highlight glow on selected nodes
        if (highlightedNodeIds && highlightedNodeIds.length > 0) {
            this.drawHighlightGlow(highlightedNodeIds);
        }
    }

    highlightNodes(nodeIds) {
        if (!this._tree) return;
        this.render(this._tree, this._pokemonName, nodeIds);
    }

    clearHighlight() {
        if (!this._tree) return;
        this.render(this._tree, this._pokemonName, null);
    }

    calculateDimensions(node, depth) {
        if (!node || node.type === 'leaf' || node.type === 'nature_leaf' || node.type === 'existing') {
            return {
                width: this.nodeWidth,
                height: this.nodeHeight
            };
        }

        const childDims = node.children.map(child => this.calculateDimensions(child, depth + 1));
        const totalChildWidth = childDims.reduce((sum, d) => sum + d.width, 0) + this.horizontalSpacing * (childDims.length - 1);
        const maxChildHeight = Math.max(...childDims.map(d => d.height));
        
        return {
            width: Math.max(this.nodeWidth, totalChildWidth),
            height: this.nodeHeight + this.verticalSpacing + maxChildHeight
        };
    }

    calculatePositions(node, x, y, availableWidth, positions) {
        if (!node) return;

        const centerX = x + availableWidth / 2;
        positions[node.id] = { x: centerX - this.nodeWidth / 2, y: y, centerX: centerX };

        if (node.children && node.children.length > 0) {
            const childDims = node.children.map(child => this.calculateDimensions(child, 0));
            const totalChildWidth = childDims.reduce((sum, d) => sum + d.width, 0) + this.horizontalSpacing * (childDims.length - 1);
            
            let childX = centerX - totalChildWidth / 2;
            const childY = y + this.nodeHeight + this.verticalSpacing;

            node.children.forEach((child, i) => {
                this.calculatePositions(child, childX, childY, childDims[i].width, positions);
                childX += childDims[i].width + this.horizontalSpacing;
            });
        }
    }

    drawConnections(node, positions, highlightedNodeIds) {
        if (!node || !node.children) return;

        const parentPos = positions[node.id];
        if (!parentPos) return;

        const isHighlighting = highlightedNodeIds && highlightedNodeIds.length > 0;

        node.children.forEach(child => {
            const childPos = positions[child.id];
            if (childPos) {
                const isHighlightedConnection = isHighlighting &&
                    highlightedNodeIds.includes(node.id) &&
                    highlightedNodeIds.includes(child.id);

                this.ctx.beginPath();
                if (isHighlightedConnection) {
                    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.9)';
                    this.ctx.lineWidth = 3;
                    this.ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
                    this.ctx.shadowBlur = 8;
                } else if (isHighlighting) {
                    this.ctx.strokeStyle = 'rgba(233, 69, 96, 0.15)';
                    this.ctx.lineWidth = 1;
                    this.ctx.shadowBlur = 0;
                } else {
                    this.ctx.strokeStyle = 'rgba(233, 69, 96, 0.4)';
                    this.ctx.lineWidth = 2;
                    this.ctx.shadowBlur = 0;
                }
                
                const startX = parentPos.centerX;
                const startY = parentPos.y + this.nodeHeight;
                const endX = childPos.centerX;
                const endY = childPos.y;
                const midY = (startY + endY) / 2;
                
                this.ctx.moveTo(startX, startY);
                this.ctx.bezierCurveTo(startX, midY, endX, midY, endX, endY);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }
            this.drawConnections(child, positions, highlightedNodeIds);
        });
    }

    drawNodes(node, positions, pokemonName, highlightedNodeIds) {
        if (!node) return;

        const pos = positions[node.id];
        if (!pos) return;

        const x = pos.x;
        const y = pos.y;
        const w = this.nodeWidth;
        const h = this.nodeHeight;

        const isHighlighting = highlightedNodeIds && highlightedNodeIds.length > 0;
        const isThisHighlighted = isHighlighting && highlightedNodeIds.includes(node.id);
        const dimmed = isHighlighting && !isThisHighlighted;

        // Node background
        let bgColor, borderColor;
        if (node.type === 'leaf') {
            bgColor = dimmed ? 'rgba(22, 33, 62, 0.4)' : 'rgba(22, 33, 62, 0.9)';
            borderColor = dimmed ? 'rgba(79, 195, 247, 0.15)' : 'rgba(79, 195, 247, 0.5)';
        } else if (node.type === 'nature_leaf') {
            bgColor = dimmed ? 'rgba(83, 52, 131, 0.4)' : 'rgba(83, 52, 131, 0.9)';
            borderColor = dimmed ? 'rgba(187, 134, 252, 0.15)' : 'rgba(187, 134, 252, 0.5)';
        } else if (node.type === 'existing') {
            bgColor = dimmed ? 'rgba(100, 80, 20, 0.4)' : 'rgba(80, 60, 10, 0.9)';
            borderColor = dimmed ? 'rgba(245, 197, 24, 0.15)' : 'rgba(245, 197, 24, 0.7)';
        } else {
            bgColor = dimmed ? 'rgba(15, 52, 96, 0.4)' : 'rgba(15, 52, 96, 0.9)';
            borderColor = dimmed ? 'rgba(233, 69, 96, 0.15)' : 'rgba(233, 69, 96, 0.5)';
        }

        if (isThisHighlighted) {
            borderColor = 'rgba(0, 229, 255, 0.9)';
        }

        // Draw rounded rect
        this.roundRect(x, y, w, h, 10, bgColor, borderColor);

        // Draw content
        this.ctx.textAlign = 'center';
        
        if (node.type === 'leaf') {
            // Gender icon
            const genderColor = node.gender === '♂' ? '#42a5f5' : '#ec407a';
            this.ctx.fillStyle = genderColor;
            this.ctx.font = 'bold 14px Outfit';
            this.ctx.fillText(node.gender || '?', x + w / 2, y + 18);
            
            // IV info
            this.ctx.fillStyle = '#e8e8f0';
            this.ctx.font = '11px Outfit';
            const ivVal = node.ivValues && node.ivValues[node.ivs[0]] !== undefined ? node.ivValues[node.ivs[0]] : 31;
            const ivText = `${ivVal} ${STAT_NAMES[node.ivs[0]]}`;
            this.ctx.fillText(ivText, x + w / 2, y + 36);
            
            // Power item
            if (node.powerItem) {
                this.ctx.fillStyle = '#f5c518';
                this.ctx.font = '10px Outfit';
                this.ctx.fillText(node.powerItem.name, x + w / 2, y + 52);
            }

            // Label
            this.ctx.fillStyle = '#6c6c88';
            this.ctx.font = '9px Outfit';
            this.ctx.fillText(`1 IV (${ivVal})`, x + w / 2, y + 68);
            
        } else if (node.type === 'nature_leaf') {
            const genderColor = node.gender === '♂' ? '#42a5f5' : '#ec407a';
            this.ctx.fillStyle = genderColor;
            this.ctx.font = 'bold 14px Outfit';
            this.ctx.fillText(node.gender || '♀', x + w / 2, y + 18);
            
            this.ctx.fillStyle = '#bb86fc';
            this.ctx.font = 'bold 11px Outfit';
            this.ctx.fillText(node.nature ? node.nature.name : 'Nature', x + w / 2, y + 36);
            
            this.ctx.fillStyle = '#f5c518';
            this.ctx.font = '10px Outfit';
            this.ctx.fillText('💎 Piedra Eterna', x + w / 2, y + 52);

            this.ctx.fillStyle = '#6c6c88';
            this.ctx.font = '9px Outfit';
            this.ctx.fillText('Naturaleza', x + w / 2, y + 68);

        } else if (node.type === 'existing') {
            // Existing pokemon node
            this.ctx.fillStyle = '#f5c518';
            this.ctx.font = 'bold 12px Outfit';
            this.ctx.fillText('⭐ TU POKÉMON', x + w / 2, y + 18);

            const genderColor = node.gender === '♂' ? '#42a5f5' : '#ec407a';
            this.ctx.fillStyle = genderColor;
            this.ctx.font = 'bold 12px Outfit';
            this.ctx.fillText(node.gender || '?', x + w / 2, y + 34);

            this.ctx.fillStyle = '#e8e8f0';
            this.ctx.font = '10px Outfit';
            const ivText = node.ivs.map(iv => STAT_NAMES[iv]).join(', ');
            this.ctx.fillText(`${node.ivs.length}x31: ${ivText}`, x + w / 2, y + 50);

            this.ctx.fillStyle = '#f5c518';
            this.ctx.font = '9px Outfit';
            this.ctx.fillText('Ya lo tienes', x + w / 2, y + 66);
            
        } else {
            // Breed result node
            const ivCount = node.ivs.length;
            
            // Show IV label with values
            const allPerfect = node.ivValues && node.ivs.every(iv => node.ivValues[iv] === 31);
            const ivLabel = allPerfect ? `${ivCount}x31` : `${ivCount} IVs`;
            
            this.ctx.fillStyle = '#e8e8f0';
            this.ctx.font = 'bold 13px Outfit';
            this.ctx.fillText(ivLabel, x + w / 2, y + 20);
            
            this.ctx.fillStyle = '#a0a0b8';
            this.ctx.font = '9px Outfit';
            // Show stat names with values when custom
            let statNames;
            if (allPerfect) {
                statNames = node.ivs.map(iv => STAT_NAMES[iv]).join(', ');
            } else {
                statNames = node.ivs.map(iv => {
                    const val = node.ivValues ? node.ivValues[iv] : 31;
                    return `${STAT_NAMES[iv]}:${val}`;
                }).join(', ');
            }
            const maxTextWidth = w - 16;
            let displayText = statNames;
            if (this.ctx.measureText(displayText).width > maxTextWidth) {
                displayText = node.ivs.map(iv => {
                    const val = node.ivValues ? node.ivValues[iv] : 31;
                    return `${iv.toUpperCase()}:${val}`;
                }).join(', ');
            }
            this.ctx.fillText(displayText, x + w / 2, y + 36);
            
            // Nature info
            if (node.inheritedNature) {
                this.ctx.fillStyle = '#bb86fc';
                this.ctx.font = '10px Outfit';
                this.ctx.fillText(`🌿 ${node.inheritedNature.name}`, x + w / 2, y + 52);
            }
            
            // Items used
            if (node.powerItems && node.powerItems.length > 0) {
                this.ctx.fillStyle = '#f5c518';
                this.ctx.font = '9px Outfit';
                const itemNames = node.powerItems.map(pi => POWER_ITEMS[pi.stat].name.split(' ')[0]).join(' + ');
                this.ctx.fillText(itemNames, x + w / 2, y + 68);
            }
        }

        // Recurse
        if (node.children) {
            node.children.forEach(child => this.drawNodes(child, positions, pokemonName, highlightedNodeIds));
        }
    }

    drawHighlightGlow(nodeIds) {
        if (!this._positions) return;
        
        nodeIds.forEach(id => {
            const pos = this._positions[id];
            if (!pos) return;
            
            const x = pos.x;
            const y = pos.y;
            const w = this.nodeWidth;
            const h = this.nodeHeight;
            
            // Draw glow outline
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 229, 255, 0.7)';
            this.ctx.shadowBlur = 15;
            this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.9)';
            this.ctx.lineWidth = 2.5;
            
            this.ctx.beginPath();
            const r = 10;
            this.ctx.moveTo(x + r, y);
            this.ctx.lineTo(x + w - r, y);
            this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            this.ctx.lineTo(x + w, y + h - r);
            this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.ctx.lineTo(x + r, y + h);
            this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            this.ctx.lineTo(x, y + r);
            this.ctx.quadraticCurveTo(x, y, x + r, y);
            this.ctx.closePath();
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }

    roundRect(x, y, w, h, r, fill, stroke) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
        
        this.ctx.fillStyle = fill;
        this.ctx.fill();
        this.ctx.strokeStyle = stroke;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    }

    setScale(newScale) {
        this.scale = Math.max(0.3, Math.min(2, newScale));
    }
}
