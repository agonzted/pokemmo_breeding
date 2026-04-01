// ========================================
// PokeMMO Breeding Planner - Main Application
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // ---- State ----
    const state = {
        selectedPokemon: null,
        selectedIVs: [],     // [{stat: 'hp', value: 31}, {stat: 'atk', value: 1}, ...]
        selectedNature: null,
        // Egg move state
        selectedEggMove: null,    // {name, type, url}
        selectedEggParent: null,  // [id, name, eggGroups[]]
        eggMoves: [],             // cached egg moves for current pokemon
        eggMoveCache: {},         // cache by pokemon id
        existingPokemon: null     // { ivs: {hp:31,...}, nature: null, gender: '♂' }
    };

    // ---- DOM References ----
    const els = {
        pokemonSearch: document.getElementById('pokemonSearch'),
        pokemonGrid: document.getElementById('pokemonGrid'),
        selectedPokemonDisplay: document.getElementById('selectedPokemonDisplay'),
        selectedPokemonImg: document.getElementById('selectedPokemonImg'),
        selectedPokemonName: document.getElementById('selectedPokemonName'),
        selectedPokemonNumber: document.getElementById('selectedPokemonNumber'),
        selectedEggGroups: document.getElementById('selectedEggGroups'),
        changePokemonBtn: document.getElementById('changePokemonBtn'),
        compatibleToggle: document.getElementById('compatibleToggle'),
        compatibleContent: document.getElementById('compatibleContent'),
        compatibleArrow: document.getElementById('compatibleArrow'),
        compatibleCount: document.getElementById('compatibleCount'),
        compatibleGroups: document.getElementById('compatibleGroups'),
        compatibleSearch: document.getElementById('compatibleSearch'),
        ivSection: document.getElementById('ivSection'),
        ivGrid: document.getElementById('ivGrid'),
        ivCount: document.getElementById('ivCount'),
        natureSection: document.getElementById('natureSection'),
        natureGrid: document.getElementById('natureGrid'),
        generateSection: document.getElementById('generateSection'),
        generateBtn: document.getElementById('generateBtn'),
        resultsSection: document.getElementById('resultsSection'),
        resultSummary: document.getElementById('resultSummary'),
        requirementsGrid: document.getElementById('requirementsGrid'),
        stepsList: document.getElementById('stepsList'),
        treeCanvas: document.getElementById('treeCanvas'),
        treeContainer: document.getElementById('treeContainer'),
        treeSection: document.getElementById('treeSection'),
        zoomInBtn: document.getElementById('zoomInBtn'),
        zoomOutBtn: document.getElementById('zoomOutBtn'),
        resetZoomBtn: document.getElementById('resetZoomBtn'),
        bgParticles: document.getElementById('bgParticles'),
        // Egg move elements
        eggMoveSection: document.getElementById('eggMoveSection'),
        eggMoveLoading: document.getElementById('eggMoveLoading'),
        eggMoveGrid: document.getElementById('eggMoveGrid'),
        eggMoveEmpty: document.getElementById('eggMoveEmpty'),
        eggMoveSelected: document.getElementById('eggMoveSelected'),
        eggMoveSelectedName: document.getElementById('eggMoveSelectedName'),
        eggMoveParentLoading: document.getElementById('eggMoveParentLoading'),
        eggMoveParentGrid: document.getElementById('eggMoveParentGrid'),
        eggMoveNoParents: document.getElementById('eggMoveNoParents'),
        // Existing pokemon elements
        existingToggle: document.getElementById('existingToggle'),
        existingInputPanel: document.getElementById('existingInputPanel'),
        existNature: document.getElementById('existNature'),
        existGender: document.getElementById('existGender'),
        existingSummary: document.getElementById('existingSummary')
    };

    // ---- Initialize ----
    createParticles();
    loadPokemonGrid();
    setupEventListeners();
    renderNatureGrid();
    initExistingSection();

    // ---- Background Particles ----
    function createParticles() {
        const colors = ['#e94560', '#0f3460', '#533483', '#f5c518', '#00d4aa', '#4fc3f7'];
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 6 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
            particle.style.animationDelay = (Math.random() * 20) + 's';
            els.bgParticles.appendChild(particle);
        }
    }

    // ---- Event Listeners ----
    function setupEventListeners() {
        // Search (unified Pokedex)
        els.pokemonSearch.addEventListener('input', () => loadPokemonGrid());

        // Change pokemon
        els.changePokemonBtn.addEventListener('click', () => {
            state.selectedPokemon = null;
            state.selectedEggMove = null;
            state.selectedEggParent = null;
            state.eggMoves = [];
            els.selectedPokemonDisplay.style.display = 'none';
            els.pokemonGrid.style.display = '';
            els.pokemonSearch.parentElement.style.display = '';
            els.eggMoveSection.style.display = 'none';
            els.resultsSection.style.display = 'none';
        });

        // Compatible toggle
        els.compatibleToggle.addEventListener('click', () => {
            const content = els.compatibleContent;
            const arrow = els.compatibleArrow;
            if (content.style.display === 'none') {
                content.style.display = 'block';
                arrow.classList.add('open');
            } else {
                content.style.display = 'none';
                arrow.classList.remove('open');
            }
        });

        // Compatible search filter
        els.compatibleSearch.addEventListener('input', () => {
            if (state.selectedPokemon) {
                renderCompatiblePokemon(state.selectedPokemon, els.compatibleSearch.value);
            }
        });

        // IV toggles + value inputs
        els.ivGrid.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const card = e.target.closest('.iv-card');
                const valueRow = card.querySelector('.iv-value-row');
                if (e.target.checked) {
                    valueRow.style.display = 'block';
                } else {
                    valueRow.style.display = 'none';
                }
                updateSelectedIVs();
            }
        });

        // IV value input changes
        els.ivGrid.addEventListener('input', (e) => {
            if (e.target.classList.contains('iv-value-input')) {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 0;
                if (val < 0) val = 0;
                if (val > 31) val = 31;
                e.target.value = val;
                updateSelectedIVs();
            }
        });

        // Nature filter
        document.querySelector('.nature-filter').addEventListener('click', (e) => {
            if (e.target.classList.contains('nature-filter-btn')) {
                document.querySelectorAll('.nature-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderNatureGrid(e.target.dataset.filter);
            }
        });

        // Generate
        els.generateBtn.addEventListener('click', generateBreedingPlan);

        // Zoom controls
        let renderer = null;
        els.zoomInBtn.addEventListener('click', () => {
            if (renderer) {
                const pokeName = state.selectedPokemon ? state.selectedPokemon[1] : 'Pokémon';
                renderer.setScale(renderer.scale + 0.2);
                renderer.render(window._lastTree, pokeName);
            }
        });
        els.zoomOutBtn.addEventListener('click', () => {
            if (renderer) {
                const pokeName = state.selectedPokemon ? state.selectedPokemon[1] : 'Pokémon';
                renderer.setScale(renderer.scale - 0.2);
                renderer.render(window._lastTree, pokeName);
            }
        });
        els.resetZoomBtn.addEventListener('click', () => {
            if (renderer) {
                const pokeName = state.selectedPokemon ? state.selectedPokemon[1] : 'Pokémon';
                renderer.setScale(1);
                renderer.render(window._lastTree, pokeName);
            }
        });

        // Store renderer reference
        window._getRenderer = () => renderer;
        window._setRenderer = (r) => { renderer = r; };
    }

    // ---- Pokemon Grid (Unified Pokedex) ----
    function loadPokemonGrid() {
        const search = els.pokemonSearch.value.toLowerCase().trim();
        
        let filtered = ALL_POKEMON;
        if (search) {
            filtered = ALL_POKEMON.filter(p => 
                p[1].toLowerCase().includes(search) || 
                p[0].toString().includes(search)
            );
        }

        // Filter out "No Eggs" pokemon (legendaries etc.)
        filtered = filtered.filter(p => !p[2].includes("No Eggs"));

        els.pokemonGrid.innerHTML = '';
        
        filtered.forEach(poke => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.dataset.id = poke[0];
            
            const img = document.createElement('img');
            img.src = getPokemonSpriteUrl(poke[0]);
            img.alt = poke[1];
            img.loading = 'lazy';
            img.onerror = function() { this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="30">?</text></svg>'; };
            
            const name = document.createElement('div');
            name.className = 'poke-name';
            name.textContent = poke[1];
            
            const num = document.createElement('div');
            num.className = 'poke-num';
            num.textContent = `#${poke[0].toString().padStart(3, '0')}`;
            
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(num);
            
            card.addEventListener('click', () => selectPokemon(poke));
            
            els.pokemonGrid.appendChild(card);
        });
    }

    // ---- Select Pokemon ----
    function selectPokemon(poke) {
        state.selectedPokemon = poke;
        
        els.selectedPokemonImg.src = getPokemonSpriteUrl(poke[0]);
        els.selectedPokemonName.textContent = poke[1];
        els.selectedPokemonNumber.textContent = `#${poke[0].toString().padStart(3, '0')}`;
        els.selectedEggGroups.textContent = `Grupo Huevo: ${poke[2].join(', ')}`;
        
        els.selectedPokemonDisplay.style.display = 'block';
        els.pokemonGrid.style.display = 'none';
        els.pokemonSearch.parentElement.style.display = 'none';
        
        // Render compatible pokemon
        els.compatibleSearch.value = '';
        els.compatibleContent.style.display = 'none';
        els.compatibleArrow.classList.remove('open');
        renderCompatiblePokemon(poke);
        
        // Show IV section (scroll to it)
        els.ivSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset IVs
        document.querySelectorAll('#ivGrid input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('.iv-card').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.iv-value-row').forEach(r => r.style.display = 'none');
        document.querySelectorAll('.iv-value-input').forEach(inp => inp.value = '31');
        updateSelectedIVs();

        // Show egg move section and fetch egg moves
        els.eggMoveSection.style.display = 'block';
        state.selectedEggMove = null;
        state.selectedEggParent = null;
        fetchEggMoves(poke[0]);
    }

    // ---- Compatible Pokemon ----
    function renderCompatiblePokemon(poke, searchFilter = '') {
        const result = getCompatiblePokemon(poke);
        els.compatibleCount.textContent = result.totalCount;
        els.compatibleGroups.innerHTML = '';

        const filter = searchFilter.toLowerCase().trim();

        // Ditto highlight (always first)
        if (result.ditto) {
            const dittoDiv = document.createElement('div');
            dittoDiv.className = 'ditto-highlight';
            dittoDiv.innerHTML = `
                <img src="${getPokemonSpriteUrl(132)}" alt="Ditto">
                <div>
                    <div class="ditto-highlight-text">🟣 Ditto (#132) — Siempre compatible</div>
                    <div class="ditto-highlight-sub">Ditto puede criar con cualquier Pokémon (excepto legendarios y otros Ditto)</div>
                </div>
            `;
            if (!filter || 'ditto'.includes(filter)) {
                els.compatibleGroups.appendChild(dittoDiv);
            }
        }

        // Groups
        const sortedGroups = Object.keys(result.byGroup).sort();
        sortedGroups.forEach(groupName => {
            let pokemonList = result.byGroup[groupName];
            
            // Apply search filter
            if (filter) {
                pokemonList = pokemonList.filter(p => 
                    p[1].toLowerCase().includes(filter) || 
                    p[0].toString().includes(filter)
                );
            }
            if (pokemonList.length === 0) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'compatible-group';

            const header = document.createElement('div');
            header.className = 'compatible-group-header';
            header.innerHTML = `
                <span class="egg-group-badge">${groupName}</span>
                <span class="egg-group-count">${pokemonList.length} Pokémon</span>
            `;

            const grid = document.createElement('div');
            grid.className = 'compatible-grid';

            pokemonList.forEach(p => {
                const card = document.createElement('div');
                card.className = 'compatible-mini-card';
                card.innerHTML = `
                    <img src="${getPokemonSpriteUrl(p[0])}" alt="${p[1]}" loading="lazy">
                    <span class="compat-poke-name">${p[1]}</span>
                    <span class="compat-poke-num">#${p[0].toString().padStart(3, '0')}</span>
                `;
                grid.appendChild(card);
            });

            groupDiv.appendChild(header);
            groupDiv.appendChild(grid);
            els.compatibleGroups.appendChild(groupDiv);
        });

        if (els.compatibleGroups.children.length === 0 && filter) {
            els.compatibleGroups.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No se encontraron Pokémon compatibles con ese filtro.</p>';
        }
    }

    // ---- IV Selection (with custom values) ----
    function updateSelectedIVs() {
        state.selectedIVs = [];
        document.querySelectorAll('#ivGrid input[type="checkbox"]').forEach(cb => {
            const card = cb.closest('.iv-card');
            const valueInput = card.querySelector('.iv-value-input');
            
            if (cb.checked) {
                const ivValue = parseInt(valueInput.value) || 31;
                state.selectedIVs.push({ stat: cb.dataset.stat, value: ivValue });
                card.classList.add('active');
                const itemDisplay = card.querySelector('.iv-item-display');
                const item = POWER_ITEMS[cb.dataset.stat];
                itemDisplay.textContent = `${item.emoji} ${item.name} → IV ${ivValue}`;
            } else {
                card.classList.remove('active');
                card.querySelector('.iv-item-display').textContent = '';
            }
        });
        
        els.ivCount.textContent = state.selectedIVs.length;
        // Nature and Generate are always visible now (optional)
    }

    // ---- Nature Grid ----
    function renderNatureGrid(filter = 'all') {
        els.natureGrid.innerHTML = '';
        
        let filtered = NATURES;
        if (filter === 'neutral') {
            filtered = NATURES.filter(n => !n.boost);
        } else if (filter !== 'all') {
            filtered = NATURES.filter(n => n.boost === filter);
        }

        filtered.forEach(nature => {
            const card = document.createElement('div');
            card.className = 'nature-card';
            if (state.selectedNature && state.selectedNature.name === nature.name) {
                card.classList.add('selected');
            }
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'nature-name';
            nameDiv.textContent = `${nature.name} (${nature.nameEs})`;
            
            const effectDiv = document.createElement('div');
            effectDiv.className = 'nature-effect';
            
            if (nature.boost) {
                effectDiv.innerHTML = `<span class="nature-boost">+${STAT_NAMES[nature.boost]}</span> / <span class="nature-reduce">-${STAT_NAMES[nature.reduce]}</span>`;
            } else {
                effectDiv.innerHTML = `<span class="nature-neutral-text">Neutral (sin efecto)</span>`;
            }
            
            card.appendChild(nameDiv);
            card.appendChild(effectDiv);
            
            card.addEventListener('click', () => {
                if (state.selectedNature && state.selectedNature.name === nature.name) {
                    // Deselect
                    card.classList.remove('selected');
                    state.selectedNature = null;
                } else {
                    document.querySelectorAll('.nature-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    state.selectedNature = nature;
                }
            });
            
            els.natureGrid.appendChild(card);
        });
    }

    // ---- Generate Breeding Plan ----
    function generateBreedingPlan() {
        if (state.selectedIVs.length === 0) {
            alert('Selecciona al menos 1 IV.');
            return;
        }

        // Use selected pokemon or generic
        const pokeName = state.selectedPokemon ? state.selectedPokemon[1] : 'Pokémon';
        const pokeId = state.selectedPokemon ? state.selectedPokemon[0] : 0;

        // Build ivConfig: map of stat -> value
        const ivConfig = {};
        state.selectedIVs.forEach(iv => {
            ivConfig[iv.stat] = iv.value;
        });

        const planner = new BreedingPlanner(
            pokeName,
            pokeId,
            state.selectedIVs.map(iv => iv.stat),
            state.selectedNature,
            ivConfig  // pass custom IV values
        );

        const plan = planner.generatePlan();
        if (!plan) return;

        // Assign genders
        planner.assignGenders(plan.tree, null);

        // Optimize with existing pokemon if provided
        if (state.existingPokemon) {
            plan.tree = planner.optimizeWithExisting(plan.tree, state.existingPokemon);
            // Recalculate requirements and steps after optimization
            plan.requirements = planner.calculateRequirements(plan.tree);
            plan.steps = planner.generateSteps(plan.tree);
            plan.totalParents = plan.requirements.totalPokemon;
            plan.totalBreedings = plan.requirements.totalBreedings;
            plan.existingPokemon = state.existingPokemon;
        }

        // Attach ivConfig to plan for rendering
        plan.ivConfig = ivConfig;

        // Attach egg move info if selected
        if (state.selectedEggMove && state.selectedEggParent) {
            plan.eggMove = {
                moveName: state.selectedEggMove.name,
                moveType: state.selectedEggMove.type || 'Normal',
                parentName: state.selectedEggParent[1],
                parentId: state.selectedEggParent[0]
            };
        }

        // Show results
        els.resultsSection.style.display = 'block';
        
        renderSummary(plan);
        renderRequirements(plan);
        renderSteps(plan);
        renderTree(plan);

        els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---- Render Summary ----
    function renderSummary(plan) {
        const ivDetails = plan.desiredIVs.map(iv => {
            const val = plan.ivConfig[iv];
            return `${STAT_NAMES[iv]}: ${val}`;
        }).join(', ');
        const natureText = plan.nature ? `${plan.nature.name} (${plan.nature.nameEs})` : 'Ninguna';
        const eggMoveText = plan.eggMove ? ` — Mov. Huevo: <strong>${capitalize(plan.eggMove.moveName)}</strong> (de ${plan.eggMove.parentName})` : '';
        
        // Count how many are 31
        const perfect31 = plan.desiredIVs.filter(iv => plan.ivConfig[iv] === 31).length;
        const totalControlled = plan.desiredIVs.length;
        const ivLabel = perfect31 === totalControlled ? `${totalControlled}x31` : `${totalControlled} IVs controlados`;

        const existingBanner = plan.existingPokemon ? 
            `<p style="color: #f5c518; font-size: 0.85rem; margin-bottom: 0.5rem;">
                ⭐ Plan optimizado usando tu Pokémon existente — se requieren menos crianzas
            </p>` : '';
        
        els.resultSummary.innerHTML = `
            <h2>🧬 Plan de Crianza para ${plan.pokemonName}</h2>
            ${existingBanner}
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                Objetivo: <strong>${ivLabel}</strong> (${ivDetails}) — Naturaleza: <strong>${natureText}</strong>${eggMoveText}
            </p>
            <div class="summary-details">
                <div class="summary-item">
                    <span class="summary-value">${plan.totalParents + (plan.eggMove ? 2 : 0)}</span>
                    <span class="summary-label">Pokémon Base</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${plan.totalBreedings + (plan.eggMove ? 2 : 0)}</span>
                    <span class="summary-label">Crianzas</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${ivLabel}</span>
                    <span class="summary-label">IVs Controlados</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${Object.keys(plan.requirements.powerItemCounts).length}</span>
                    <span class="summary-label">Tipos de Objetos</span>
                </div>
            </div>
        `;
    }

    // ---- Render Requirements (Shopping List) ----
    function renderRequirements(plan) {
        els.requirementsGrid.innerHTML = '';

        const leaves = plan.requirements.leaves;
        const pokeName = plan.pokemonName;

        // Separate existing pokemon nodes from regular leaves
        const existingLeaves = leaves.filter(l => l.type === 'existing' || l.isExisting);
        const regularLeaves = leaves.filter(l => l.type !== 'existing' && !l.isExisting);

        // --- Section 0: Existing Pokemon (if any) ---
        if (existingLeaves.length > 0) {
            const existSection = document.createElement('div');
            existSection.className = 'shopping-section';
            existSection.innerHTML = `<h4 class="shopping-title">⭐ Tu Pokémon Existente</h4>
                <p class="shopping-subtitle">Ya tienes este Pokémon — será usado como padre en la crianza</p>`;
            const existList = document.createElement('div');
            existList.className = 'shopping-list';
            existingLeaves.forEach(leaf => {
                const row = document.createElement('div');
                row.className = 'shopping-row';
                row.style.borderColor = 'rgba(245, 197, 24, 0.3)';
                row.style.background = 'rgba(245, 197, 24, 0.05)';
                const ivPills = leaf.ivs.map(iv => {
                    const val = plan.ivConfig ? (plan.ivConfig[iv] !== undefined ? plan.ivConfig[iv] : 31) : 31;
                    return `<span class="iv-pill perfect">${STAT_NAMES[iv]}: ${val}</span>`;
                }).join('');
                const gClass = leaf.gender === '♂' ? 'male' : 'female';
                row.innerHTML = `
                    <div class="shopping-qty"><span class="qty-number" style="color: #f5c518;">⭐</span></div>
                    <div class="shopping-detail">
                        <div class="shopping-pokemon-name" style="color: #f5c518;">${pokeName} (ya lo tienes)</div>
                        <div class="shopping-ivs">${ivPills}</div>
                        <div class="shopping-item">No necesitas conseguirlo</div>
                    </div>
                    <div class="shopping-genders"><span class="gender-tag ${gClass}">1${leaf.gender}</span></div>
                `;
                existList.appendChild(row);
            });
            existSection.appendChild(existList);
            els.requirementsGrid.appendChild(existSection);
        }

        // Group regular leaves by their IV signature
        const groups = {};
        let natureCount = 0;
        let natureObj = null;

        regularLeaves.forEach(leaf => {
            if (leaf.isNatureParent) {
                natureCount++;
                natureObj = leaf.nature;
                return;
            }
            // Create a key based on IVs and their values
            const ivDesc = leaf.ivs.map(iv => {
                const val = plan.ivConfig ? (plan.ivConfig[iv] !== undefined ? plan.ivConfig[iv] : 31) : 31;
                return `${STAT_NAMES[iv]}: ${val}`;
            }).join(', ');
            const powerItemName = leaf.powerItem ? leaf.powerItem.name : '—';
            const key = `${ivDesc}||${powerItemName}`;
            
            if (!groups[key]) {
                groups[key] = {
                    ivDesc,
                    powerItemName,
                    ivs: [...leaf.ivs],
                    total: 0,
                    males: 0,
                    females: 0,
                    powerItem: leaf.powerItem
                };
            }
            groups[key].total++;
            if (leaf.gender === '♂') groups[key].males++;
            else groups[key].females++;
        });

        // --- Section 1: Base Pokemon Shopping List ---
        const pokemonSection = document.createElement('div');
        pokemonSection.className = 'shopping-section';
        pokemonSection.innerHTML = `<h4 class="shopping-title">🎯 Pokémon Base Necesarios</h4>
            <p class="shopping-subtitle">${pokeName} o Ditto con los siguientes IVs — Necesitas conseguirlos antes de empezar</p>`;

        const pokemonList = document.createElement('div');
        pokemonList.className = 'shopping-list';

        Object.values(groups).forEach(group => {
            const row = document.createElement('div');
            row.className = 'shopping-row';

            const genderBreakdown = [];
            if (group.males > 0) genderBreakdown.push(`<span class="gender-tag male">${group.males}♂</span>`);
            if (group.females > 0) genderBreakdown.push(`<span class="gender-tag female">${group.females}♀</span>`);

            const ivPills = group.ivs.map(iv => {
                const val = plan.ivConfig ? (plan.ivConfig[iv] !== undefined ? plan.ivConfig[iv] : 31) : 31;
                const isPerf = val === 31;
                return `<span class="iv-pill ${isPerf ? 'perfect' : 'custom'}">${STAT_NAMES[iv]}: ${val}</span>`;
            }).join('');

            row.innerHTML = `
                <div class="shopping-qty">
                    <span class="qty-number">${group.total}×</span>
                </div>
                <div class="shopping-detail">
                    <div class="shopping-pokemon-name">${pokeName} / Ditto</div>
                    <div class="shopping-ivs">${ivPills}</div>
                    <div class="shopping-item">🔧 ${group.powerItemName}</div>
                </div>
                <div class="shopping-genders">${genderBreakdown.join(' ')}</div>
            `;
            pokemonList.appendChild(row);
        });

        // Nature pokemon if needed
        if (natureCount > 0 && natureObj) {
            const row = document.createElement('div');
            row.className = 'shopping-row nature-row';
            row.innerHTML = `
                <div class="shopping-qty">
                    <span class="qty-number">${natureCount}×</span>
                </div>
                <div class="shopping-detail">
                    <div class="shopping-pokemon-name">${pokeName} / Ditto con Naturaleza</div>
                    <div class="shopping-ivs">
                        <span class="iv-pill nature">🌿 ${natureObj.name} (${natureObj.nameEs})</span>
                    </div>
                    <div class="shopping-item">💎 Piedra Eterna</div>
                </div>
                <div class="shopping-genders"></div>
            `;
            pokemonList.appendChild(row);
        }

        pokemonSection.appendChild(pokemonList);
        els.requirementsGrid.appendChild(pokemonSection);

        // --- Section 2: Items Needed ---
        const itemsSection = document.createElement('div');
        itemsSection.className = 'shopping-section';
        itemsSection.innerHTML = `<h4 class="shopping-title">🎒 Objetos Necesarios</h4>
            <p class="shopping-subtitle">Debes tener estos objetos antes de empezar las crianzas</p>`;

        const itemsList = document.createElement('div');
        itemsList.className = 'shopping-list';

        for (const [name, count] of Object.entries(plan.requirements.powerItemCounts)) {
            const row = document.createElement('div');
            row.className = 'shopping-row item-row';
            // Find the emoji for this power item
            let emoji = '🔧';
            for (const key in POWER_ITEMS) {
                if (POWER_ITEMS[key].name === name) {
                    emoji = POWER_ITEMS[key].emoji;
                    break;
                }
            }
            row.innerHTML = `
                <div class="shopping-qty">
                    <span class="qty-number">${count}×</span>
                </div>
                <div class="shopping-detail">
                    <div class="shopping-pokemon-name">${emoji} ${name}</div>
                    <div class="shopping-item">Hereda IV al pokémon hijo</div>
                </div>
                <div class="shopping-genders"></div>
            `;
            itemsList.appendChild(row);
        }
        if (plan.requirements.needsEverstone) {
            const evCount = plan.requirements.everstoneCount || 1;
            const row = document.createElement('div');
            row.className = 'shopping-row item-row';
            row.innerHTML = `
                <div class="shopping-qty">
                    <span class="qty-number">${evCount}×</span>
                </div>
                <div class="shopping-detail">
                    <div class="shopping-pokemon-name">💎 Piedra Eterna</div>
                    <div class="shopping-item">Hereda naturaleza al pokémon hijo (1 por cada crianza con naturaleza)</div>
                </div>
                <div class="shopping-genders"></div>
            `;
            itemsList.appendChild(row);
        }

        itemsSection.appendChild(itemsList);
        els.requirementsGrid.appendChild(itemsSection);

        // --- Section 3: Egg Move Parent (if selected) ---
        if (plan.eggMove) {
            const eggSection = document.createElement('div');
            eggSection.className = 'shopping-section';
            eggSection.innerHTML = `<h4 class="shopping-title">🥚 Movimiento Huevo</h4>
                <p class="shopping-subtitle">Un padre ♂ debe conocer este movimiento para pasarlo a la cría</p>`;

            const eggList = document.createElement('div');
            eggList.className = 'shopping-list';
            const eggRow = document.createElement('div');
            eggRow.className = 'shopping-row';
            eggRow.innerHTML = `
                <div class="shopping-qty">
                    <span class="qty-number">1×</span>
                </div>
                <div class="shopping-detail">
                    <div class="shopping-pokemon-name">🥚 ${plan.eggMove.parentName} ♂</div>
                    <div class="shopping-ivs">
                        <span class="iv-pill nature">${capitalize(plan.eggMove.moveName)}</span>
                    </div>
                    <div class="shopping-item">Debe conocer el movimiento antes de criar</div>
                </div>
                <div class="shopping-genders"><span class="gender-tag male">1♂</span></div>
            `;
            eggList.appendChild(eggRow);
            eggSection.appendChild(eggList);
            els.requirementsGrid.appendChild(eggSection);
        }
    }

    // ---- Render Steps ----
    function renderSteps(plan) {
        els.stepsList.innerHTML = '';
        let activeStep = null;

        // --- Egg Move Preliminary Step ---
        if (plan.eggMove) {
            const eggDiv = document.createElement('div');
            eggDiv.className = 'breed-step egg-move-step';
            eggDiv.style.borderColor = 'rgba(187, 134, 252, 0.4)';
            eggDiv.style.background = 'rgba(187, 134, 252, 0.05)';

            const pokeName = plan.pokemonName || 'Pokémon';
            const parentName = plan.eggMove.parentName;
            const moveName = capitalize(plan.eggMove.moveName);

            eggDiv.innerHTML = `
                <span class="step-number" style="background: var(--accent-purple);">🥚</span>
                <div class="step-content">
                    <div class="step-title">
                        Paso Previo: Obtener Movimiento Huevo — <strong>${moveName}</strong>
                    </div>
                    <div class="step-detail">
                        <strong>Padre 1:</strong> ${parentName} ♂ que conozca ${moveName}<br>
                        <strong>Padre 2:</strong> ${pokeName} ♀ (cualquiera)
                    </div>
                    <div class="step-detail" style="margin-top: 6px; color: var(--accent-purple);">
                        → La cría debe ser <strong>${pokeName} ♂</strong> que conozca <strong>${moveName}</strong><br>
                        <span style="color: var(--text-muted); font-size: 0.8rem;">
                            Usa esta cría como uno de los padres ♂ base en los pasos siguientes
                        </span>
                    </div>
                    <div class="step-items">
                        <span class="item-badge" style="background: rgba(187, 134, 252, 0.15); border-color: rgba(187, 134, 252, 0.3);">
                            🥚 ${moveName} — hereda de ${parentName} ♂
                        </span>
                    </div>
                </div>
            `;
            els.stepsList.appendChild(eggDiv);
        }

        plan.steps.forEach((step, idx) => {
            const div = document.createElement('div');
            div.className = 'breed-step';
            div.style.cursor = 'pointer';

            // When egg move exists, the original "last step" is no longer final
            const isOriginalLastStep = step.isLastStep;
            const isActuallyFinal = isOriginalLastStep && !plan.eggMove;

            if (isActuallyFinal) {
                div.style.borderColor = 'rgba(245, 197, 24, 0.4)';
                div.style.background = 'rgba(245, 197, 24, 0.05)';
            }
            
            const itemBadges = step.items.map(item => {
                const cls = item.type === 'everstone' ? 'everstone' : 'power-item';
                return `<span class="item-badge ${cls}">${item.name} — ${item.detail}</span>`;
            }).join('');

            // Result gender indicator
            let genderHtml = '';
            if (isActuallyFinal) {
                genderHtml = `<span class="result-gender-badge final">✨ Pokémon Final</span>`;
            } else if (isOriginalLastStep && plan.eggMove) {
                // With egg move, this step's result must be ♀ for the egg move step
                genderHtml = `<span class="result-gender-badge female">Cría debe ser: ♀</span>`;
            } else if (step.resultGender) {
                const gClass = step.resultGender === '♂' ? 'male' : 'female';
                genderHtml = `<span class="result-gender-badge ${gClass}">Cría debe ser: ${step.resultGender}</span>`;
            }

            div.innerHTML = `
                <span class="step-number">${step.number}</span>
                <div class="step-content">
                    <div class="step-title">
                        ${isActuallyFinal ? '⭐ ' : ''}Criar → Resultado: ${step.resultDesc}
                        ${genderHtml}
                    </div>
                    <div class="step-detail">
                        <strong>Padre 1:</strong> ${step.parent1Desc}<br>
                        <strong>Padre 2:</strong> ${step.parent2Desc}
                    </div>
                    <div class="step-items">${itemBadges}</div>
                </div>
            `;

            // Click to highlight nodes in tree
            div.addEventListener('click', () => {
                const renderer = window._getRenderer();
                if (!renderer) return;

                const allSteps = els.stepsList.querySelectorAll('.breed-step');

                if (activeStep === step.number) {
                    // Deselect
                    activeStep = null;
                    allSteps.forEach(s => s.classList.remove('step-active'));
                    renderer.clearHighlight();
                } else {
                    // Select this step
                    activeStep = step.number;
                    allSteps.forEach(s => s.classList.remove('step-active'));
                    div.classList.add('step-active');
                    
                    const nodeIds = [step.nodeId, step.parent1Id, step.parent2Id];
                    renderer.highlightNodes(nodeIds);

                    // Scroll the tree into view
                    els.treeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            
            els.stepsList.appendChild(div);
        });

        // ---- Add FINAL step: Combine egg move with tree result ----
        if (plan.eggMove) {
            const lastStep = plan.steps[plan.steps.length - 1];
            const finalStepNum = lastStep.number + 1;
            const pokeName = plan.pokemonName || 'Pokémon';
            const moveName = capitalize(plan.eggMove.moveName);

            const finalDiv = document.createElement('div');
            finalDiv.className = 'breed-step';
            finalDiv.style.borderColor = 'rgba(245, 197, 24, 0.4)';
            finalDiv.style.background = 'rgba(245, 197, 24, 0.05)';

            // Items for final step
            const finalItems = [];
            if (plan.nature) {
                finalItems.push(`<span class="item-badge everstone">💎 Piedra Eterna — en Padre 2 ♀ → mantiene ${plan.nature.name}</span>`);
            }

            // Build result description
            const ivNames = plan.desiredIVs.map(iv => STAT_NAMES[iv]).join(', ');
            let resultDesc = `${plan.desiredIVs.length}x31 (${ivNames})`;
            if (plan.nature) resultDesc += ` + Naturaleza ${plan.nature.name}`;
            resultDesc += ` + ${moveName}`;

            finalDiv.innerHTML = `
                <span class="step-number" style="background: #f5c518;">${finalStepNum}</span>
                <div class="step-content">
                    <div class="step-title">
                        ⭐ Criar → Resultado Final: ${resultDesc}
                        <span class="result-gender-badge final">✨ Pokémon Final</span>
                    </div>
                    <div class="step-detail">
                        <strong>Padre 1:</strong> ${pokeName} ♂ del Paso Previo (con ${moveName})<br>
                        <strong>Padre 2:</strong> ${pokeName} criado ♀ del paso ${lastStep.number} (con ${lastStep.resultDesc})
                    </div>
                    <div class="step-items">${finalItems.join('')}</div>
                    <div class="step-detail" style="margin-top: 8px; padding: 8px 12px; background: rgba(233, 69, 96, 0.1); border-left: 3px solid var(--accent-red); border-radius: 0 6px 6px 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                        🎯 ${plan.nature ? 'Naturaleza garantizada con Piedra Eterna.' : ''} Los IVs se heredan por azar (2 aleatorios de ambos padres). Como la ♀ tiene todos los IVs deseados, hay buena probabilidad de heredarlos. Puede requerir varios intentos.
                    </div>
                </div>
            `;
            els.stepsList.appendChild(finalDiv);
        }
    }

    // ---- Render Tree Diagram ----
    function renderTree(plan) {
        const renderer = new TreeRenderer(els.treeCanvas);
        window._setRenderer(renderer);
        window._lastTree = plan.tree;
        renderer.render(plan.tree, plan.pokemonName);

        // Resize container
        els.treeContainer.style.minHeight = (els.treeCanvas.height + 20) + 'px';
    }

    // ========================================
    // Egg Move Functions
    // ========================================

    // Move type -> color mapping
    const MOVE_TYPE_COLORS = {
        normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
        grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
        ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
        rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
        steel: '#B8B8D0', fairy: '#EE99AC'
    };

    // Capitalize first letter of each word
    function capitalize(str) {
        return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // Fetch egg moves from PokeAPI for a given pokemon ID
    async function fetchEggMoves(pokemonId) {
        // Check cache
        if (state.eggMoveCache[pokemonId]) {
            state.eggMoves = state.eggMoveCache[pokemonId];
            renderEggMoves();
            return;
        }

        // Show loading
        els.eggMoveLoading.style.display = 'flex';
        els.eggMoveGrid.innerHTML = '';
        els.eggMoveEmpty.style.display = 'none';
        els.eggMoveSelected.style.display = 'none';

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
            const data = await response.json();

            // Filter for egg moves in black-white (Gen 5 = PokeMMO)
            const eggMoves = [];
            const seenMoves = new Set();

            for (const moveEntry of data.moves) {
                for (const detail of moveEntry.version_group_details) {
                    if (detail.move_learn_method.name === 'egg') {
                        const vg = detail.version_group.name;
                        // Accept black-white or black-2-white-2 (both are Gen 5)
                        if (vg === 'black-white' || vg === 'black-2-white-2') {
                            if (!seenMoves.has(moveEntry.move.name)) {
                                seenMoves.add(moveEntry.move.name);
                                eggMoves.push({
                                    name: moveEntry.move.name,
                                    url: moveEntry.move.url
                                });
                            }
                        }
                    }
                }
            }

            // Fetch move details (type) in parallel, max 10 at a time
            const moveBatches = [];
            for (let i = 0; i < eggMoves.length; i += 10) {
                moveBatches.push(eggMoves.slice(i, i + 10));
            }

            for (const batch of moveBatches) {
                const promises = batch.map(async (m) => {
                    try {
                        const moveResp = await fetch(m.url);
                        const moveData = await moveResp.json();
                        m.type = moveData.type.name;
                        m.power = moveData.power;
                        m.accuracy = moveData.accuracy;
                        m.damageClass = moveData.damage_class.name;
                    } catch (e) {
                        m.type = 'normal';
                    }
                });
                await Promise.all(promises);
            }

            // Sort alphabetically
            eggMoves.sort((a, b) => a.name.localeCompare(b.name));

            state.eggMoves = eggMoves;
            state.eggMoveCache[pokemonId] = eggMoves;
        } catch (error) {
            console.error('Error fetching egg moves:', error);
            state.eggMoves = [];
        }

        els.eggMoveLoading.style.display = 'none';
        renderEggMoves();
    }

    // Render egg move chips
    function renderEggMoves() {
        els.eggMoveGrid.innerHTML = '';
        els.eggMoveSelected.style.display = 'none';

        if (state.eggMoves.length === 0) {
            els.eggMoveEmpty.style.display = 'block';
            return;
        }

        els.eggMoveEmpty.style.display = 'none';

        state.eggMoves.forEach(move => {
            const chip = document.createElement('div');
            chip.className = 'egg-move-chip';
            if (state.selectedEggMove && state.selectedEggMove.name === move.name) {
                chip.classList.add('selected');
            }

            const typeColor = MOVE_TYPE_COLORS[move.type] || '#888';
            const classIcon = move.damageClass === 'physical' ? '💥' : move.damageClass === 'special' ? '✨' : '📊';

            chip.innerHTML = `
                <span class="move-type" style="background: ${typeColor}; color: #fff;">${capitalize(move.type)}</span>
                <span>${capitalize(move.name)}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${classIcon}</span>
            `;

            chip.addEventListener('click', () => {
                if (state.selectedEggMove && state.selectedEggMove.name === move.name) {
                    // Deselect
                    state.selectedEggMove = null;
                    state.selectedEggParent = null;
                    chip.classList.remove('selected');
                    els.eggMoveSelected.style.display = 'none';
                } else {
                    // Select
                    document.querySelectorAll('.egg-move-chip').forEach(c => c.classList.remove('selected'));
                    chip.classList.add('selected');
                    state.selectedEggMove = move;
                    state.selectedEggParent = null;
                    selectEggMove(move);
                }
            });

            els.eggMoveGrid.appendChild(chip);
        });
    }

    // When an egg move is selected, find compatible parents
    async function selectEggMove(move) {
        els.eggMoveSelected.style.display = 'block';
        els.eggMoveSelectedName.textContent = capitalize(move.name);
        els.eggMoveParentGrid.innerHTML = '';
        els.eggMoveNoParents.style.display = 'none';
        els.eggMoveParentLoading.style.display = 'flex';

        const targetPoke = state.selectedPokemon;
        if (!targetPoke) return;

        const targetEggGroups = targetPoke[2]; // e.g. ["Field"]

        try {
            // Find all pokemon in the same egg groups that can learn this move by level-up in Gen 5
            const compatibleParents = [];

            // Get all pokemon from pokedex that share an egg group
            const sameGroupPokemon = ALL_POKEMON.filter(p => {
                if (p[0] === targetPoke[0]) return false; // skip self
                if (p[2].includes('No Eggs') || p[2].includes('Ditto')) return false;
                return p[2].some(g => targetEggGroups.includes(g));
            });

            // For each compatible pokemon, check if they learn the move by level-up in Gen 5
            // We'll batch the API calls, checking up to 30 at a time for speed
            const batchSize = 15;
            for (let i = 0; i < sameGroupPokemon.length; i += batchSize) {
                const batch = sameGroupPokemon.slice(i, i + batchSize);
                const promises = batch.map(async (p) => {
                    try {
                        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${p[0]}/`);
                        const data = await resp.json();

                        for (const moveEntry of data.moves) {
                            if (moveEntry.move.name === move.name) {
                                for (const detail of moveEntry.version_group_details) {
                                    const vg = detail.version_group.name;
                                    const method = detail.move_learn_method.name;
                                    if ((vg === 'black-white' || vg === 'black-2-white-2') && method === 'level-up') {
                                        return { pokemon: p, level: detail.level_learned_at };
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        // skip on error
                    }
                    return null;
                });

                const results = await Promise.all(promises);
                results.forEach(r => {
                    if (r) compatibleParents.push(r);
                });

                // If we already found some, show them and keep searching
                if (compatibleParents.length > 0) {
                    renderEggMoveParents(compatibleParents);
                }
            }

            els.eggMoveParentLoading.style.display = 'none';

            if (compatibleParents.length === 0) {
                els.eggMoveNoParents.style.display = 'block';
            } else {
                renderEggMoveParents(compatibleParents);
            }
        } catch (error) {
            console.error('Error finding egg move parents:', error);
            els.eggMoveParentLoading.style.display = 'none';
            els.eggMoveNoParents.style.display = 'block';
        }
    }

    // Render compatible parent cards
    function renderEggMoveParents(parents) {
        els.eggMoveParentGrid.innerHTML = '';
        els.eggMoveNoParents.style.display = 'none';

        // Sort by level learned
        parents.sort((a, b) => a.level - b.level);

        parents.forEach(({ pokemon, level }) => {
            const card = document.createElement('div');
            card.className = 'egg-parent-card';
            if (state.selectedEggParent && state.selectedEggParent[0] === pokemon[0]) {
                card.classList.add('selected');
            }

            card.innerHTML = `
                <img src="${getPokemonSpriteUrl(pokemon[0])}" alt="${pokemon[1]}">
                <div class="parent-info">
                    <span class="parent-name">${pokemon[1]}</span>
                    <span class="parent-learn">Nivel ${level}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.egg-parent-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.selectedEggParent = pokemon;
            });

            els.eggMoveParentGrid.appendChild(card);
        });
    }

    // ========================================
    // Existing Pokemon Section
    // ========================================

    function initExistingSection() {
        // Populate nature dropdown
        const select = els.existNature;
        NATURES.forEach(n => {
            const opt = document.createElement('option');
            opt.value = n.name;
            opt.textContent = `${n.name} (${n.nameEs})`;
            select.appendChild(opt);
        });

        // Toggle show/hide
        els.existingToggle.addEventListener('change', () => {
            const checked = els.existingToggle.checked;
            els.existingInputPanel.style.display = checked ? 'block' : 'none';
            if (!checked) {
                state.existingPokemon = null;
                els.existingSummary.style.display = 'none';
            } else {
                updateExistingPokemon();
            }
        });

        // IV inputs: highlight 31s and update state
        document.querySelectorAll('.existing-iv-input').forEach(input => {
            input.addEventListener('input', () => {
                const val = parseInt(input.value) || 0;
                input.classList.toggle('perfect', val === 31);
                updateExistingPokemon();
            });
        });

        // Nature and gender changes
        els.existNature.addEventListener('change', updateExistingPokemon);
        els.existGender.addEventListener('change', updateExistingPokemon);
    }

    function updateExistingPokemon() {
        const ivs = {};
        const statMap = { hp: 'existIvHp', atk: 'existIvAtk', def: 'existIvDef', spa: 'existIvSpa', spd: 'existIvSpd', spe: 'existIvSpe' };
        for (const [stat, id] of Object.entries(statMap)) {
            ivs[stat] = parseInt(document.getElementById(id).value) || 0;
        }

        const natureVal = els.existNature.value;
        let nature = null;
        if (natureVal) {
            nature = NATURES.find(n => n.name === natureVal) || null;
        }

        const gender = els.existGender.value;

        state.existingPokemon = { ivs, nature, gender };

        // Update summary
        const perfect = Object.entries(ivs).filter(([_, v]) => v === 31);
        if (perfect.length > 0) {
            const pills = perfect.map(([stat]) => 
                `<span class="existing-31">${STAT_NAMES[stat]}: 31</span>`
            ).join(', ');
            const natText = nature ? ` | Naturaleza: ${nature.name} (${nature.nameEs})` : '';
            els.existingSummary.innerHTML = `✨ Tu Pokémon tiene <strong>${perfect.length}</strong> IVs perfectos: ${pills}${natText} — Género: ${gender}`;
            els.existingSummary.style.display = 'block';
        } else {
            els.existingSummary.innerHTML = `⚠️ Tu Pokémon no tiene IVs en 31. No se podrá optimizar la ruta.`;
            els.existingSummary.style.display = 'block';
        }
    }

    // ========================================
    // MODE TABS (Planner / Optimizer)
    // ========================================
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById('plannerTab').style.display = target === 'planner' ? 'block' : 'none';
            document.getElementById('optimizerTab').style.display = target === 'optimizer' ? 'block' : 'none';
        });
    });

    // ========================================
    // OPTIMIZER TAB
    // ========================================
    const optState = {
        selectedPokemon: null, // [id, name]
        parents: [],           // array of { ivs, nature, gender }
        parentCount: 0,
        selectedEggMove: null,
        selectedEggParent: null,
        eggMovesLoaded: false,
        eggMoves: []
    };

    const optEls = {
        search: document.getElementById('optPokemonSearch'),
        grid: document.getElementById('optPokemonGrid'),
        display: document.getElementById('optSelectedDisplay'),
        img: document.getElementById('optSelectedImg'),
        name: document.getElementById('optSelectedName'),
        number: document.getElementById('optSelectedNumber'),
        changeBtn: document.getElementById('optChangeBtn'),
        parentCards: document.getElementById('optParentCards'),
        addBtn: document.getElementById('optAddParentBtn'),
        desiredNature: document.getElementById('optDesiredNature'),
        desiredEggMove: document.getElementById('optDesiredEggMove'),
        eggParentSelect: document.getElementById('optEggMoveParentSelect'),
        eggParentGrid: document.getElementById('optEggMoveParentGrid'),
        generateBtn: document.getElementById('optGenerateBtn'),
        resultsSection: document.getElementById('optResultsSection'),
        resultSummary: document.getElementById('optResultSummary'),
        stepsList: document.getElementById('optStepsList')
    };

    // Populate nature dropdown
    NATURES.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n.name;
        opt.textContent = `${n.name} (${n.nameEs})`;
        optEls.desiredNature.appendChild(opt);
    });

    // Pokemon search for optimizer — uses same data + card structure as Planner
    function loadOptPokemonGrid() {
        const search = optEls.search.value.toLowerCase().trim();

        let filtered = ALL_POKEMON;
        if (search) {
            filtered = ALL_POKEMON.filter(p =>
                p[1].toLowerCase().includes(search) ||
                p[0].toString().includes(search)
            );
        }

        // Same filter as Planner: exclude No Eggs legendaries
        filtered = filtered.filter(p => !p[2].includes("No Eggs"));

        optEls.grid.innerHTML = '';

        filtered.forEach(poke => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.dataset.id = poke[0];

            const img = document.createElement('img');
            img.src = getPokemonSpriteUrl(poke[0]);
            img.alt = poke[1];
            img.loading = 'lazy';
            img.onerror = function() { this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="30">?</text></svg>'; };

            const name = document.createElement('div');
            name.className = 'poke-name';
            name.textContent = poke[1];

            const num = document.createElement('div');
            num.className = 'poke-num';
            num.textContent = `#${poke[0].toString().padStart(3, '0')}`;

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(num);

            card.addEventListener('click', () => selectOptPokemon(poke));

            optEls.grid.appendChild(card);
        });
    }

    // Load initial grid
    loadOptPokemonGrid();

    optEls.search.addEventListener('input', () => {
        loadOptPokemonGrid();
        optEls.grid.style.display = 'grid';
    });

    optEls.search.addEventListener('focus', () => {
        loadOptPokemonGrid();
        optEls.grid.style.display = 'grid';
    });

    function selectOptPokemon(poke) {
        optState.selectedPokemon = poke;
        optEls.grid.style.display = 'none';
        optEls.search.parentElement.style.display = 'none';
        optEls.display.style.display = 'block';
        optEls.img.src = getPokemonSpriteUrl(poke[0]);
        optEls.name.textContent = poke[1];
        optEls.number.textContent = `#${poke[0].toString().padStart(3, '0')}`;

        // Load egg moves for this pokemon
        loadOptEggMoves(poke[0]);
    }

    optEls.changeBtn.addEventListener('click', () => {
        optState.selectedPokemon = null;
        optEls.display.style.display = 'none';
        optEls.search.parentElement.style.display = 'block';
        optEls.search.value = '';
        optEls.grid.style.display = 'grid';
        loadOptPokemonGrid();
        // Reset egg moves
        optEls.desiredEggMove.innerHTML = '<option value="">— Ninguno —</option>';
        optState.eggMovesLoaded = false;
        optState.eggMoves = [];
    });

    // Egg moves loading
    async function loadOptEggMoves(pokemonId) {
        optEls.desiredEggMove.innerHTML = '<option value="">— Cargando... —</option>';
        try {
            const resp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
            const species = await resp.json();
            const moveResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const moveData = await moveResp.json();

            const eggMoves = moveData.moves.filter(m =>
                m.version_group_details.some(vgd =>
                    vgd.move_learn_method.name === 'egg' &&
                    ['black-white', 'black-2-white-2'].includes(vgd.version_group.name)
                )
            ).map(m => ({ name: m.move.name, url: m.move.url }));

            optState.eggMoves = eggMoves;
            optState.eggMovesLoaded = true;

            optEls.desiredEggMove.innerHTML = '<option value="">— Ninguno —</option>';
            eggMoves.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.name;
                opt.textContent = capitalize(m.name);
                optEls.desiredEggMove.appendChild(opt);
            });
        } catch {
            optEls.desiredEggMove.innerHTML = '<option value="">— Error al cargar —</option>';
        }
    }

    // When egg move selected, fetch compatible parents
    optEls.desiredEggMove.addEventListener('change', async () => {
        const moveName = optEls.desiredEggMove.value;
        if (!moveName || !optState.selectedPokemon) {
            optEls.eggParentSelect.style.display = 'none';
            optState.selectedEggMove = null;
            optState.selectedEggParent = null;
            return;
        }

        optState.selectedEggMove = { name: moveName };
        optState.selectedEggParent = null;
        optEls.eggParentSelect.style.display = 'block';
        optEls.eggParentGrid.innerHTML = '<div class="egg-move-loading"><div class="spinner"></div><span>Buscando padres...</span></div>';

        try {
            // Fetch species for egg groups
            const specResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${optState.selectedPokemon[0]}`);
            const specData = await specResp.json();
            const eggGroups = specData.egg_groups.map(g => g.name);

            // Fetch move data
            const moveResp = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
            const moveData = await moveResp.json();

            // Find pokemon that learn this move by level in the same egg group
            const learnedBy = moveData.learned_by_pokemon || [];
            const compatible = [];

            for (const poke of learnedBy.slice(0, 30)) {
                try {
                    const pid = parseInt(poke.url.split('/').filter(Boolean).pop());
                    if (pid > 649 || pid === optState.selectedPokemon[0]) continue;

                    const pSpecResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pid}`);
                    const pSpec = await pSpecResp.json();
                    const pEggGroups = pSpec.egg_groups.map(g => g.name);
                    const shares = pEggGroups.some(g => eggGroups.includes(g));
                    if (!shares) continue;

                    const pMoveResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pid}`);
                    const pMoveData = await pMoveResp.json();
                    const moveEntry = pMoveData.moves.find(m => m.move.name === moveName);
                    if (!moveEntry) continue;

                    const levelEntry = moveEntry.version_group_details.find(vgd =>
                        vgd.move_learn_method.name === 'level-up' &&
                        ['black-white', 'black-2-white-2'].includes(vgd.version_group.name)
                    );
                    if (levelEntry) {
                        compatible.push([pid, pSpec.name, pEggGroups, levelEntry.level_learned_at]);
                    }
                    if (compatible.length >= 6) break;
                } catch { /* skip */ }
            }

            optEls.eggParentGrid.innerHTML = '';
            if (compatible.length === 0) {
                optEls.eggParentGrid.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem;">No se encontraron padres compatibles.</span>';
                return;
            }

            compatible.forEach(p => {
                const card = document.createElement('div');
                card.className = 'egg-parent-card';
                card.innerHTML = `
                    <img src="${getPokemonSpriteUrl(p[0])}" alt="${p[1]}">
                    <div class="parent-info">
                        <span class="parent-name">${capitalize(p[1])}</span>
                        <span class="parent-learn">Nivel ${p[3]}</span>
                    </div>
                `;
                card.addEventListener('click', () => {
                    optEls.eggParentGrid.querySelectorAll('.egg-parent-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    optState.selectedEggParent = p;
                });
                optEls.eggParentGrid.appendChild(card);
            });
        } catch {
            optEls.eggParentGrid.innerHTML = '<span style="color: var(--text-muted);">Error al buscar padres.</span>';
        }
    });

    // ---- Parent Card Management ----
    function addParentCard() {
        optState.parentCount++;
        const idx = optState.parentCount;
        const card = document.createElement('div');
        card.className = 'opt-parent-card';
        card.dataset.idx = idx;
        card.innerHTML = `
            <div class="opt-parent-header">
                <span class="opt-parent-label">Pokémon #${idx}</span>
                <button class="opt-parent-remove" data-idx="${idx}">✕ Quitar</button>
            </div>
            <div class="opt-parent-ivs">
                <div class="existing-iv-field"><label>❤️ HP</label><input type="number" min="0" max="31" value="0" class="existing-iv-input opt-iv" data-stat="hp"></div>
                <div class="existing-iv-field"><label>⚔️ Atk</label><input type="number" min="0" max="31" value="0" class="existing-iv-input opt-iv" data-stat="atk"></div>
                <div class="existing-iv-field"><label>🛡️ Def</label><input type="number" min="0" max="31" value="0" class="existing-iv-input opt-iv" data-stat="def"></div>
                <div class="existing-iv-field"><label>🔮 SpA</label><input type="number" min="0" max="31" value="0" class="existing-iv-input opt-iv" data-stat="spa"></div>
                <div class="existing-iv-field"><label>🧿 SpD</label><input type="number" min="0" max="31" value="0" class="existing-iv-input opt-iv" data-stat="spd"></div>
                <div class="existing-iv-field"><label>⚡ Spe</label><input type="number" min="0" max="31" value="0" class="existing-iv-input opt-iv" data-stat="spe"></div>
            </div>
            <div class="opt-parent-extra">
                <select class="existing-select opt-nature">
                    <option value="">— Naturaleza —</option>
                    ${NATURES.map(n => `<option value="${n.name}">${n.name} (${n.nameEs})</option>`).join('')}
                </select>
                <select class="existing-select opt-gender">
                    <option value="♂">♂ Macho</option>
                    <option value="♀">♀ Hembra</option>
                </select>
            </div>
        `;

        // Highlight 31s
        card.querySelectorAll('.opt-iv').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.toggle('perfect', parseInt(input.value) === 31);
            });
        });

        // Remove button
        card.querySelector('.opt-parent-remove').addEventListener('click', () => {
            card.remove();
        });

        optEls.parentCards.appendChild(card);
    }

    optEls.addBtn.addEventListener('click', addParentCard);

    // Start with 2 parent cards
    addParentCard();
    addParentCard();

    // ---- Collect parent data ----
    function collectParents() {
        const cards = optEls.parentCards.querySelectorAll('.opt-parent-card');
        const parents = [];
        cards.forEach(card => {
            const ivs = {};
            card.querySelectorAll('.opt-iv').forEach(input => {
                ivs[input.dataset.stat] = parseInt(input.value) || 0;
            });
            const natureVal = card.querySelector('.opt-nature').value;
            const nature = natureVal ? NATURES.find(n => n.name === natureVal) : null;
            const gender = card.querySelector('.opt-gender').value;
            parents.push({ ivs, nature, gender });
        });
        return parents;
    }

    // ---- OPTIMIZER ALGORITHM ----
    optEls.generateBtn.addEventListener('click', () => {
        if (!optState.selectedPokemon) {
            alert('Selecciona la especie del Pokémon primero.');
            return;
        }

        const parents = collectParents();
        if (parents.length < 1) {
            alert('Agrega al menos 1 Pokémon.');
            return;
        }

        // Desired IVs
        const desiredIVs = [];
        document.querySelectorAll('#optDesiredIVs input[type="checkbox"]:checked').forEach(cb => {
            desiredIVs.push(cb.dataset.stat);
        });
        if (desiredIVs.length === 0) {
            alert('Selecciona al menos 1 IV deseado.');
            return;
        }

        // Desired nature
        const desiredNatureVal = optEls.desiredNature.value;
        const desiredNature = desiredNatureVal ? NATURES.find(n => n.name === desiredNatureVal) : null;

        // Egg move
        const eggMoveName = optEls.desiredEggMove.value;
        const eggMoveParent = optState.selectedEggParent;

        const pokeName = optState.selectedPokemon[1];

        // Run optimization
        const plan = optimizeBreeding(parents, desiredIVs, desiredNature, eggMoveName, eggMoveParent, pokeName);
        renderOptResults(plan, pokeName);
    });

    function optimizeBreeding(parents, desiredIVs, desiredNature, eggMoveName, eggMoveParent, pokeName) {
        const steps = [];
        let stepNum = 0;

        // Analyze each parent: which desired IVs do they already have at 31?
        const parentAnalysis = parents.map((p, i) => {
            const matching31s = desiredIVs.filter(stat => p.ivs[stat] === 31);
            const hasNature = desiredNature && p.nature && p.nature.name === desiredNature.name;
            return { ...p, index: i, matching31s, hasNature, label: `Pokémon #${i + 1}` };
        });

        // Find best pair (most IVs covered together, different genders)
        let bestPair = null;
        let bestScore = -1;

        for (let i = 0; i < parentAnalysis.length; i++) {
            for (let j = i + 1; j < parentAnalysis.length; j++) {
                const p1 = parentAnalysis[i];
                const p2 = parentAnalysis[j];
                if (p1.gender === p2.gender) continue;
                const combined = new Set([...p1.matching31s, ...p2.matching31s]);
                // Score: IVs covered + bonus if one has nature
                let score = combined.size * 10;
                if (p1.hasNature || p2.hasNature) score += 5;
                if (score > bestScore) {
                    bestScore = score;
                    bestPair = [p1, p2];
                }
            }
        }

        // Fallback: any pair if no gender match
        if (!bestPair && parentAnalysis.length >= 2) {
            bestPair = [parentAnalysis[0], parentAnalysis[1]];
        }

        const needsEggMove = eggMoveName && eggMoveParent;
        const eggParentName = needsEggMove ? capitalize(eggMoveParent[1]) : '';
        const eggMoveCap = needsEggMove ? capitalize(eggMoveName) : '';

        // =========================================
        // STRATEGY: IVs + Nature FIRST, Egg Move LAST
        // =========================================
        if (bestPair) {
            const [p1, p2] = bestPair;
            const male = p1.gender === '♂' ? p1 : p2;
            const female = p1.gender === '♀' ? p1 : p2;

            const maleSet = new Set(male.matching31s);
            const femaleSet = new Set(female.matching31s);
            const overlap = desiredIVs.filter(iv => maleSet.has(iv) && femaleSet.has(iv));
            const maleUnique = desiredIVs.filter(iv => maleSet.has(iv) && !femaleSet.has(iv));
            const femaleUnique = desiredIVs.filter(iv => femaleSet.has(iv) && !maleSet.has(iv));
            const missing = desiredIVs.filter(iv => !maleSet.has(iv) && !femaleSet.has(iv));

            const maleHasNature = male.hasNature;
            const femaleHasNature = female.hasNature;

            // ---- STEP 1: Breed best pair for IVs + Nature ----
            const items1 = [];

            if (desiredNature && (maleHasNature || femaleHasNature)) {
                if (maleHasNature) {
                    items1.push({ name: '💎 Piedra Eterna', detail: `en ${male.label} ♂ → hereda ${desiredNature.name} (${desiredNature.nameEs})` });
                    if (femaleUnique.length > 0) {
                        const stat = femaleUnique[0];
                        items1.push({ name: `${POWER_ITEMS[stat].emoji} ${POWER_ITEMS[stat].name}`, detail: `en ${female.label} ♀ → garantiza ${STAT_NAMES[stat]}: 31` });
                    }
                } else {
                    items1.push({ name: '💎 Piedra Eterna', detail: `en ${female.label} ♀ → hereda ${desiredNature.name} (${desiredNature.nameEs})` });
                    if (maleUnique.length > 0) {
                        const stat = maleUnique[0];
                        items1.push({ name: `${POWER_ITEMS[stat].emoji} ${POWER_ITEMS[stat].name}`, detail: `en ${male.label} ♂ → garantiza ${STAT_NAMES[stat]}: 31` });
                    }
                }
            } else {
                if (maleUnique.length > 0) {
                    const stat = maleUnique[0];
                    items1.push({ name: `${POWER_ITEMS[stat].emoji} ${POWER_ITEMS[stat].name}`, detail: `en ${male.label} ♂ → garantiza ${STAT_NAMES[stat]}: 31` });
                }
                if (femaleUnique.length > 0) {
                    const stat = femaleUnique[0];
                    items1.push({ name: `${POWER_ITEMS[stat].emoji} ${POWER_ITEMS[stat].name}`, detail: `en ${female.label} ♀ → garantiza ${STAT_NAMES[stat]}: 31` });
                }
            }

            const coveredIVs = [...new Set([...overlap, ...maleUnique, ...femaleUnique])];
            const coveredText = coveredIVs.map(iv => `${STAT_NAMES[iv]}: 31`).join(', ');
            const natOK = desiredNature && (maleHasNature || femaleHasNature);
            const resultNature = natOK ? ` + ${desiredNature.name}` : '';

            // Guaranteed vs chance IVs
            const guaranteedIVs = [];
            const chanceIVs = [];
            // Power item guarantees 1 IV, everstone guarantees nature
            if (natOK && maleHasNature && femaleUnique.length > 0) {
                guaranteedIVs.push(femaleUnique[0]);
            } else if (natOK && femaleHasNature && maleUnique.length > 0) {
                guaranteedIVs.push(maleUnique[0]);
            } else if (!desiredNature) {
                if (maleUnique.length > 0) guaranteedIVs.push(maleUnique[0]);
                if (femaleUnique.length > 0) guaranteedIVs.push(femaleUnique[0]);
            }
            coveredIVs.forEach(iv => {
                if (!guaranteedIVs.includes(iv)) chanceIVs.push(iv);
            });

            let step1Note = '';
            if (overlap.length > 0) {
                step1Note = `💡 ${overlap.map(iv => STAT_NAMES[iv]).join(' y ')} están en ambos padres — alta probabilidad de heredar.`;
            }
            if (missing.length > 0) {
                step1Note += ` ⚠️ ${missing.map(iv => STAT_NAMES[iv]).join(', ')} no están cubiertos por ningún padre.`;
            }

            stepNum++;
            const step1IsFinal = !needsEggMove && missing.length === 0 && (natOK || !desiredNature);

            steps.push({
                number: stepNum,
                type: 'breed',
                title: `Criar: ${male.label} ♂ × ${female.label} ♀`,
                parent1: `Tu ${male.label} (${pokeName} ♂, ${male.matching31s.map(iv => STAT_NAMES[iv]).join(', ') || 'sin IVs'})`,
                parent2: `Tu ${female.label} (${pokeName} ♀, ${female.matching31s.map(iv => STAT_NAMES[iv]).join(', ') || 'sin IVs'})`,
                result: `${pokeName} con ${coveredText || 'IVs aleatorios'}${resultNature}`,
                items: items1,
                note: step1Note || null,
                isFinal: step1IsFinal,
                extra: needsEggMove ? '⚠️ Necesitas que la cría sea ♀ para el siguiente paso del movimiento huevo.' : null
            });

            // ---- STEP 2: Get Egg Move (if needed) ----
            if (needsEggMove) {
                // Find a spare parent that can be sacrificed for egg move breeding
                const spareParents = parentAnalysis.filter(p =>
                    p !== male && p !== female
                );
                const spareMale = spareParents.find(p => p.gender === '♂');

                stepNum++;
                let eggFemaleSource = '';
                if (spareMale) {
                    eggFemaleSource = `${spareMale.label} (${pokeName} ♂) × Ditto → obtén una ♀ ${pokeName}. Luego: `;
                }

                steps.push({
                    number: stepNum,
                    type: 'egg',
                    title: `Obtener Movimiento Huevo: ${eggMoveCap}`,
                    parent1: `${eggParentName} ♂ (debe conocer ${eggMoveCap} por nivel)`,
                    parent2: spareMale
                        ? `♀ ${pokeName} (obtenida de ${spareMale.label} × Ditto, o cualquier ♀ ${pokeName})`
                        : `♀ ${pokeName} (cualquiera, puedes comprar/capturar una)`,
                    result: `${pokeName} ♂ que conozca ${eggMoveCap}`,
                    items: [{ name: `🥚 ${eggMoveCap}`, detail: `se hereda del ♂ ${eggParentName} al hijo` }],
                    note: `El movimiento huevo SOLO pasa del padre ♂ a la cría. La cría debe ser ♂ para el siguiente paso.`,
                    isFinal: false
                });

                // ---- STEP 3: Combine egg move + IVs/nature ----
                stepNum++;
                const items3 = [];
                const step3warnings = [];

                // The ♀ result from step 1 has the IVs + nature
                // The ♂ from step 2 has the egg move but NO IVs
                // Each parent can hold ONE item. ♀ can hold Everstone (nature) OR Power Item (1 IV)
                // ♂ has no useful IVs so his Power Item is useless

                if (natOK) {
                    // Result ♀ has the correct nature → use Everstone
                    items3.push({ name: '💎 Piedra Eterna', detail: `en Resultado ♀ del Paso 1 → mantiene ${desiredNature.name}` });
                    step3warnings.push(`Naturaleza ${desiredNature.name} garantizada con Piedra Eterna.`);
                    step3warnings.push(`IVs NO garantizados — se heredan 2 aleatorios de ambos padres.`);
                    if (coveredIVs.length > 0) {
                        step3warnings.push(`Si la ♀ tiene ${coveredIVs.map(iv => STAT_NAMES[iv]).join(', ')}, hay probabilidad de heredarlos.`);
                    }
                } else if (desiredNature) {
                    // Need nature from external source
                    items3.push({ name: '💎 Piedra Eterna', detail: `en un padre con ${desiredNature.name} → hereda naturaleza` });
                    step3warnings.push(`Necesitas que algún padre tenga ${desiredNature.name} o adicionar otro paso.`);
                }

                // Best strategy: if no nature needed, use power item on ♀ for guaranteed IV
                if (!desiredNature && coveredIVs.length > 0) {
                    const bestIV = coveredIVs[0];
                    items3.push({ name: `${POWER_ITEMS[bestIV].emoji} ${POWER_ITEMS[bestIV].name}`, detail: `en Resultado ♀ del Paso 1 → garantiza ${STAT_NAMES[bestIV]}: 31` });
                }

                steps.push({
                    number: stepNum,
                    type: 'final',
                    title: `Combinar: Egg Move + IVs + Naturaleza`,
                    parent1: `${pokeName} ♂ del Paso ${stepNum - 1} (con ${eggMoveCap}, sin IVs)`,
                    parent2: `${pokeName} ♀ del Paso 1 (con ${coveredText}${resultNature})`,
                    result: `${pokeName} con ${eggMoveCap}${resultNature}`,
                    items: items3,
                    note: step3warnings.join(' '),
                    isFinal: true,
                    extra: `🎯 En este paso solo puedes garantizar: ${natOK ? 'Naturaleza (Piedra Eterna)' : '1 IV (Power Item)'}. Los demás IVs dependen del azar (2 heredados aleatorios de 5 disponibles). Puede requerir varios intentos.`
                });
            }

            // Nature from external (no egg move case, neither parent has nature)
            if (!needsEggMove && desiredNature && !maleHasNature && !femaleHasNature) {
                stepNum++;
                steps.push({
                    number: stepNum,
                    type: 'breed',
                    title: `Transferir Naturaleza: ${desiredNature.name}`,
                    parent1: `${pokeName} / Ditto con naturaleza ${desiredNature.name} (${desiredNature.nameEs}) + Piedra Eterna`,
                    parent2: `Resultado del paso anterior (${pokeName})`,
                    result: `${pokeName} con ${coveredText} + Naturaleza ${desiredNature.name}`,
                    items: [
                        { name: '💎 Piedra Eterna', detail: `en padre con ${desiredNature.name} → hereda naturaleza` },
                        coveredIVs.length > 0 ? { name: `${POWER_ITEMS[coveredIVs[0]].emoji} ${POWER_ITEMS[coveredIVs[0]].name}`, detail: `en resultado anterior → hereda ${STAT_NAMES[coveredIVs[0]]}` } : null
                    ].filter(Boolean),
                    note: 'El padre de naturaleza debe ser Ditto o compatible.',
                    isFinal: true
                });
            }

        } else if (parents.length === 1) {
            const p = parentAnalysis[0];
            const missing = desiredIVs.filter(iv => p.ivs[iv] !== 31);

            if (missing.length === 0 && !desiredNature && !needsEggMove) {
                stepNum++;
                steps.push({
                    number: stepNum, type: 'info',
                    title: '✅ Tu Pokémon ya cumple todos los requisitos',
                    parent1: '', parent2: '',
                    result: `${pokeName} ya tiene ${desiredIVs.map(iv => STAT_NAMES[iv]).join(', ')} perfecto`,
                    items: [], note: null, isFinal: true
                });
            } else {
                stepNum++;
                steps.push({
                    number: stepNum, type: 'breed',
                    title: `Criar para completar IVs faltantes`,
                    parent1: `Tu ${p.label} (${pokeName} ${p.gender})`,
                    parent2: `Ditto / ${pokeName} con ${missing.map(iv => STAT_NAMES[iv] + ': 31').join(', ')}`,
                    result: `${pokeName} mejorado`,
                    items: missing.slice(0, 2).map((iv, i) => ({
                        name: `${POWER_ITEMS[iv].emoji} ${POWER_ITEMS[iv].name}`,
                        detail: `en Padre ${i + 1} → hereda ${STAT_NAMES[iv]}`
                    })),
                    note: missing.length > 2 ? `⚠️ Tienes ${missing.length} IVs faltantes. Con Power Items solo puedes garantizar 2 por crianza.` : null,
                    isFinal: true
                });
            }
        }

        return {
            steps,
            totalSteps: steps.length,
            desiredIVs,
            desiredNature,
            eggMoveName: eggMoveName ? capitalize(eggMoveName) : null,
            parents: parentAnalysis
        };
    }

    // ---- Render optimizer results ----
    function renderOptResults(plan, pokeName) {
        optEls.resultsSection.style.display = 'block';

        // Summary
        const ivText = plan.desiredIVs.map(iv => `${STAT_NAMES[iv]}: 31`).join(', ');
        const natText = plan.desiredNature ? `Naturaleza: ${plan.desiredNature.name} (${plan.desiredNature.nameEs})` : 'Sin preferencia de naturaleza';
        const eggText = plan.eggMoveName ? ` | Mov. Huevo: ${plan.eggMoveName}` : '';

        optEls.resultSummary.innerHTML = `
            <h2>⚡ Plan Optimizado para ${pokeName}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                Objetivo: <strong>${plan.desiredIVs.length}x31</strong> (${ivText}) — ${natText}${eggText}
            </p>
            <div class="summary-details">
                <div class="summary-item">
                    <span class="summary-value">${plan.parents.length}</span>
                    <span class="summary-label">Pokémon Tuyos</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${plan.totalSteps}</span>
                    <span class="summary-label">Pasos</span>
                </div>
            </div>
        `;

        // Steps
        optEls.stepsList.innerHTML = '';
        plan.steps.forEach(step => {
            const div = document.createElement('div');
            const stepClass = step.type === 'egg' ? 'egg-step' : step.type === 'final' ? 'final-step' : '';
            div.className = `opt-step ${stepClass} ${step.isFinal ? 'final-step' : ''}`;

            const itemBadges = step.items.map(item =>
                `<span class="item-badge ${item.name.includes('Eterna') ? 'everstone' : 'power-item'}">${item.name} — ${item.detail}</span>`
            ).join('');

            const numberStyle = step.type === 'egg'
                ? 'style="background: var(--accent-purple);"'
                : step.isFinal
                    ? 'style="background: #f5c518;"'
                    : '';

            div.innerHTML = `
                <div class="opt-step-title">
                    <span class="opt-step-number" ${numberStyle}>${step.type === 'egg' ? '🥚' : step.number}</span>
                    ${step.title}
                </div>
                ${step.parent1 ? `<div class="opt-step-detail">
                    <strong>Padre 1:</strong> ${step.parent1}<br>
                    <strong>Padre 2:</strong> ${step.parent2}
                </div>` : ''}
                <div class="opt-step-items">${itemBadges}</div>
                <div class="opt-step-result">
                    → Resultado: <strong>${step.result}</strong>
                    ${step.isFinal ? ' <span style="color: #f5c518;">✨ Pokémon Final</span>' : ''}
                </div>
                ${step.note ? `<div style="margin-top: 0.5rem; padding: 8px 12px; background: rgba(245, 197, 24, 0.08); border-radius: 6px; font-size: 0.85rem; color: #f5c518; line-height: 1.5;">${step.note}</div>` : ''}
                ${step.extra ? `<div style="margin-top: 0.5rem; padding: 8px 12px; background: rgba(233, 69, 96, 0.1); border-left: 3px solid var(--accent-red); border-radius: 0 6px 6px 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${step.extra}</div>` : ''}
            `;

            optEls.stepsList.appendChild(div);
        });

        optEls.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
