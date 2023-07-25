function sanitizeString(string){
    const regex = /^SPECIES_|^TYPE_|^ABILITY_|^MOVE_|^SPLIT_|FLAG_|^EFFECT_|^Z_EFFECT|^ITEM_|^EGG_GROUP_|^EVO_|^MAP_|^NATURE_/ig
    const unsanitizedString = string.toString().replace(regex, "")
    let matchArray = unsanitizedString.match(/\w+/g)
    if(matchArray){
        for (i = 0; i < matchArray.length; i++){
            matchArray[i] = matchArray[i].split('_')
            for (j = 0; j < matchArray[i].length; j++){
                matchArray[i][j] = matchArray[i][j][0].toUpperCase() + matchArray[i][j].slice(1).toLowerCase()
            }
            matchArray[i] = matchArray[i].join(" ")
        }
        return matchArray.join(" ")
    }
    else
        return unsanitizedString
}










async function fetchData(){
    history.pushState(null, null, location.href)
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    await forceUpdate()

    await fetchMovesObj()
    await fetchAbilitiesObj()
    await fetchSpeciesObj()
    await fetchTypeChart()
    await fetchLocationsObj()
    await fetchStrategiesObj()

    await setDataList()
    await setFilters()
    await displaySetup()
    await displayParams(urlParams)

    await window.scrollTo(0, 0)
}


async function fetchTypeChart(){
    const rawTypeChart = await fetch("https://raw.githubusercontent.com/ydarissep/inclement-emerald-pokedex/main/src/typeChart.json")
    window.typeChart = await rawTypeChart.json()
}









async function forceUpdate(){
    const update = 12
    if(localStorage.getItem("update") != `${update} EliteR`){
        await localStorage.clear()
        await localStorage.setItem("update", `${update} EliteR`)
        await footerP("Fetching data please wait... this is only run once")
    }
}












function footerP(input){
    if(input === "")
        document.querySelectorAll("#footer > p").forEach(paragraph => paragraph.remove())

    const paragraph = document.createElement("p")
    const footer = document.getElementById("footer")
    paragraph.innerText = input
    footer.append(paragraph)
}







function setDataList(){
    window.speciesIngameNameArray = []
    window.typeCount = {}
    for(const name in species){
        if(species[name]["baseSpeed"] <= 0){
            continue
        }
        const option = document.createElement("option")
        option.innerText = sanitizeString(name)
        speciesIngameNameArray.push(option.innerText)
        speciesPanelInputSpeciesDataList.append(option)

        if(!(species[name]["type1"] in typeCount)){
            typeCount[species[name]["type1"]] = 0
        }
        if(!(species[name]["type2"] in typeCount)){
            typeCount[species[name]["type2"]] = 0
        }
        if(!(speciesHasType3(species[name]) in typeCount)){
            typeCount[speciesHasType3(species[name])] = 0
        }

        typeCount[species[name]["type1"]] += 1
        if(species[name]["type1"] !== species[name]["type2"]){
            typeCount[species[name]["type2"]] += 1
        }
        if(speciesHasType3(species[name]) && speciesHasType3(species[name]) !== species[name]["type1"] && speciesHasType3(species[name]) !== species[name]["type2"]){
            typeCount[speciesHasType3(species[name])] += 1
        }
    }

    window.abilitiesIngameNameArray = []
    for(const abilityName in abilities){
        if(!abilities[abilityName]["description"] || !/[1-9aA-zZ]/.test(abilities[abilityName]["ingameName"])){
            continue
        }
        const option = document.createElement("option")
        option.innerText = abilities[abilityName]["ingameName"]
        abilitiesIngameNameArray.push(option.innerText)
        abilitiesInputDataList.append(option)
    }
}







function getSpeciesSpriteSrc(speciesName){
    if(sprites[speciesName]){
        if(sprites[speciesName].length < 500){
            localStorage.removeItem(speciesName)
            spriteRemoveBgReturnBase64(speciesName, species)
            return species[speciesName]["sprite"]
        }
        else{
            return sprites[speciesName]
        }
    }
    else{
        spriteRemoveBgReturnBase64(speciesName, species)
        return species[speciesName]["sprite"]
    }
}






async function refreshURLParams(){
    const url = document.location.href.split("?")[0] + "?"
    let params = ""

    if(!speciesPanelMainContainer.classList.contains("hide")){
        params += `species=${panelSpecies}&`
    }
    if(document.getElementsByClassName("activeTable").length > 0){
        params += `table=${document.getElementsByClassName("activeTable")[0].id}&`
    }
    if(document.getElementsByClassName("activeFilter")[0].getElementsByClassName("filter").length > 0){
        params += "filter="
        const filters = document.getElementsByClassName("activeFilter")[0].getElementsByClassName("filter")
        for(let i = 0, j = filters.length; i < j; i++){
            if(!/>|<|=/.test(filters[i].innerText)){
                let param = filters[i].innerText.split(":")
                params += `${param[0]}:${param[1].trim()}`
                if(i !== j - 1){
                    params += ","
                }
            }
        }
        params += "&"
    }
    if(document.getElementsByClassName("activeInput")[0].value !== ""){
        params += `input=${document.getElementsByClassName("activeInput")[0].value}&`
    }

    await getHistoryState()
    window.history.replaceState(`${url}${params}`, null, `${url}${params}`)
    return `${url}${params}`, null, `${url}${params}`
}






async function displayParams(urlParams){
    if(urlParams.get("species")){
        scrollToSpecies = urlParams.get("species")
        createSpeciesPanel(scrollToSpecies)
    }
    else{
        speciesPanel("hide")
    }
    if(urlParams.get("table")){
        await tableButtonClick(document.getElementById(urlParams.get("table")).id.replace("Table", ""))
    }
    if(urlParams.get("filter")){
        urlParams.get("filter").split(",").forEach(filter => {
            createFilter(filter.split(":")[1], filter.split(":")[0])
        })
    }
    if(urlParams.get("input")){
        document.getElementsByClassName("activeInput")[0].value = urlParams.get("input")
        document.getElementsByClassName("activeInput")[0].dispatchEvent(new Event("input"))
    }

    await refreshURLParams()
}







async function getHistoryState(){
    let historyStateObj = {}
    if(!speciesPanelMainContainer.classList.contains("hide")){
        historyStateObj["species"] = panelSpecies
    }
    if(document.getElementsByClassName("activeTable").length > 0){
        historyStateObj["table"] = document.getElementsByClassName("activeTable")[0].id
    }
    if(document.getElementsByClassName("filter").length > 0){
        historyStateObj["filter"] = {}
        const filters = document.getElementsByClassName("filter")
        for(let i = 0, j = filters.length; i < j; i++){
            const table = filters[i].parentElement.id.replace("FilterContainer", "")
            if(!(table in historyStateObj["filter"])){
                historyStateObj["filter"][table] = []
            }
            historyStateObj["filter"][table].push(filters[i].innerText)
        }
    }

    if(JSON.stringify(historyObj.slice(-1)[0]) !== JSON.stringify(historyStateObj)){
        historyObj.push(historyStateObj)
    }
}







async function displayHistoryObj(historyStateObj){
    deleteFiltersFromTable()
    if(historyStateObj){
        if("species" in historyStateObj){
            scrollToSpecies = historyStateObj["species"]
            await createSpeciesPanel(scrollToSpecies)
            window.scrollTo(0, 0)
        }
        else{
            speciesPanel("hide")
        }
        if("table" in historyStateObj){
            await tableButtonClick(historyStateObj["table"].replace("Table", ""))

            deleteFiltersFromTable()
            if("filter" in historyStateObj){
                Object.keys(historyStateObj["filter"]).forEach(key => {
                    if(key === historyStateObj["table"].replace("Table", "")){
                        for(filter of historyStateObj["filter"][key]){
                            if(!/>|<|=/.test(filter)){
                                createFilter(filter.split(":")[1].trim(), filter.split(":")[0])
                            }
                        }
                    }
                })
            }
        }
    }
}








function speciesCanLearnMove(speciesObj, moveName){
    const index = ["levelUpLearnsets", "TMHMLearnsets", "eggMovesLearnsets", "tutorLearnsets"]
    for(let i = 0; i < index.length; i++){
        if(index[i] in speciesObj){
            for(let j = 0; j < speciesObj[index[i]].length; j++){
                if(typeof(speciesObj[index[i]][j]) == "object"){
                    if(speciesObj[index[i]][j][0] == moveName){
                        return true
                    }
                }
                else if(typeof(speciesObj[index[i]][j] == "string")){
                    if(speciesObj[index[i]][j] == moveName){
                        return true
                    }
                }
            }
        }
    }

    return false
}










function speciesCanLearnType(speciesObj, type){
    const index = ["levelUpLearnsets", "TMHMLearnsets", "eggMovesLearnsets", "tutorLearnsets"]
    const atk = speciesObj["baseAttack"]
    const spAtk = speciesObj["baseSpAttack"]
    let split = false
    let total = 0

    if(atk > spAtk){
        if(atk / spAtk < 1.3){
            split = "mixed"
        }
        else{
            split = "SPLIT_PHYSICAL"
        }
    }
    else{
        if(spAtk / atk < 1.3){
            split = "mixed"
        }
        else{
            split = "SPLIT_SPECIAL"
        }
    }

    let duplicateArray = []
    let move = "MOVE_NONE"
    for(let i = 0; i < index.length; i++){
        if(index[i] in speciesObj){
            for(let j = 0; j < speciesObj[index[i]].length; j++){
                if(typeof(speciesObj[index[i]][j]) == "object"){
                    move = speciesObj[index[i]][j][0]
                }
                else if(typeof(speciesObj[index[i]][j] == "string")){
                    move = speciesObj[index[i]][j]
                }
                
                if(moves[move]["type"] === type && !duplicateArray.includes(move)){
                    if(split === "mixed" || moves[move]["split"] === split){
                        duplicateArray.push(move)
                        if(moves[move]["power"] > 100){
                            total += 1
                        }
                        else if(moves[move]["power"] >= 80){
                            total += 1.5
                        }
                        else if(moves[move]["power"] >= 60){
                            total += 0.5
                        }
                        else{
                            total += 0.25
                        }
                    }
                }
            }
        }
    }
    

    return total
}











function getSpeciesBestCoverageTypes(speciesObj){
    let offensiveTypeChart = {}
    let speciesCanLearnTypeArray = {}
    let top3TypesArray = []
    Object.keys(typeChart).forEach(type => {

        offensiveTypeChart[type] = getPokemonEffectivenessValueAgainstType(speciesObj, type)

        if(type !== speciesObj["type1"] && type !== speciesObj["type2"] && type !== speciesHasType3(speciesObj)){
            const value = speciesCanLearnType(speciesObj, type)
            if(value > 0){
                speciesCanLearnTypeArray[type] = value
            }
        }
    })

    Object.keys(speciesCanLearnTypeArray).forEach(offensiveType => {
        let total = speciesCanLearnTypeArray[offensiveType]

        if(total > 3){
            total = 0
        }
        else if(total < 0.5){
            total = -6
        }
        else if(total < 1){
            total = -4
        }
        else{
            total = -2
        }

        Object.keys(typeChart).forEach(defensiveType => {
            let value = 0
            if(getOffensiveTypeValue(offensiveType, defensiveType) > offensiveTypeChart[defensiveType]){

                value += getOffensiveTypeValue(offensiveType, defensiveType) - offensiveTypeChart[defensiveType]

                if(getOffensiveTypeValue(offensiveType, defensiveType) > 1){
                    if(getPokemonEffectivenessValueAgainstType(speciesObj, defensiveType) < 1){
                        value += 0.5
                    }
                    else if(getPokemonEffectivenessValueAgainstType(speciesObj, defensiveType) === 1){
                        value += 0.25
                    }
                }
            }
            
            if(getPokemonResistanceValueAgainstType(speciesObj, defensiveType) > 1){
                if(getOffensiveTypeValue(offensiveType, defensiveType) === 0){
                    value -= 0.5
                }
                else if(getOffensiveTypeValue(offensiveType, defensiveType) < 1){
                    value -= 0.25
                }
            }

            if(getOffensiveTypeValue(offensiveType, defensiveType) < 1 && getPokemonEffectivenessValueAgainstType(speciesObj, defensiveType) < 1){
                value -= 0.25
            }

            total += value * (1 + (typeCount[defensiveType] / Object.keys(species).length))
        })
        top3TypesArray.push([offensiveType, total])
    })

    top3TypesArray.sort((a, b) => {
        return b[1] - a[1]
    })

    top3TypesArray = top3TypesArray.filter(n => n[1] >= 5)

    return top3TypesArray.slice(0, 3)
}









function getOffensiveTypeValue(offensiveType, defensiveType){
    return typeChart[offensiveType][defensiveType]
}

function getPokemonResistanceValueAgainstType(speciesObj, type){
    if((speciesObj["type1"] !== speciesObj["type2"]) && speciesObj["type2"] !== undefined){
        if(speciesHasType3(speciesObj) && speciesHasType3(speciesObj) !== speciesObj["type1"] && speciesHasType3(speciesObj) !== speciesObj["type2"]){
            return typeChart[type][speciesObj["type1"]] * typeChart[type][speciesObj["type2"]] * typeChart[type][speciesHasType3(speciesObj)]
        }
        else{
            return typeChart[type][speciesObj["type1"]] * typeChart[type][speciesObj["type2"]]
        }
    }
    else{
        if(speciesHasType3(speciesObj) && speciesHasType3(speciesObj) !== speciesObj["type1"] && speciesHasType3(speciesObj) !== speciesObj["type2"]){
            return typeChart[type][speciesObj["type1"]] * typeChart[type][speciesHasType3(speciesObj)]
        }
        else{
            return typeChart[type][speciesObj["type1"]]
        }
    }
}

function getPokemonEffectivenessValueAgainstType(speciesObj, type){
    let offensiveValue = typeChart[speciesObj["type1"]][type]
    if(speciesObj["type2"] !== undefined){
        if(typeChart[speciesObj["type2"]][type] > typeChart[speciesObj["type1"]][type]){
            offensiveValue = typeChart[speciesObj["type2"]][type]
        }
    }
    if(speciesHasType3(speciesObj)){
        if(typeChart[speciesHasType3(speciesObj)][type] > typeChart[speciesObj["type1"]][type] && typeChart[speciesHasType3(speciesObj)][type] > typeChart[speciesObj["type2"]][type]){
            offensiveValue = typeChart[speciesHasType3(speciesObj)][type]
        }
    }

    return offensiveValue
}









function speciesHasType3(speciesObj){
    for(let i = 0, j = speciesObj["innates"].length; i < j; i++){
        if(speciesObj["innates"][i] === "ABILITY_TERAVOLT"){
            return "TYPE_ELECTRIC"
        }
        else if(speciesObj["innates"][i] === "ABILITY_TURBOBLAZE"){
            return "TYPE_FIRE"
        }
        else if(speciesObj["innates"][i] === "ABILITY_AQUATIC"){
            return "TYPE_WATER"
        }
        else if(speciesObj["innates"][i] === "ABILITY_DRAGONFLY" || speciesObj["innates"][i] === "ABILITY_HALF_DRAKE"){
            return "TYPE_DRAGON"
        }
        else if(speciesObj["innates"][i] === "ABILITY_GROUNDED"){
            return "TYPE_GROUND"
        }
        else if(speciesObj["innates"][i] === "ABILITY_ICE_AGE"){
            return "TYPE_ICE"
        }
        else if(speciesObj["innates"][i] === "ABILITY_METALLIC"){
            return "TYPE_STEEL"
        }
        else if(speciesObj["innates"][i] === "ABILITY_PHANTOM"){
            return "TYPE_GHOST"
        }
    }
    return false
}
















window.ignoreString = `
// Gen 8
#define SPECIES_SKWOVET 819
#define SPECIES_GREEDENT 820
#define SPECIES_BLIPBUG 824
#define SPECIES_DOTTLER 825
#define SPECIES_ORBEETLE 826
#define SPECIES_NICKIT 827
#define SPECIES_THIEVUL 828
#define SPECIES_GOSSIFLEUR 829
#define SPECIES_ELDEGOSS 830
#define SPECIES_WOOLOO 831
#define SPECIES_DUBWOOL 832
#define SPECIES_CHEWTLE 833
#define SPECIES_DREDNAW 834
#define SPECIES_SILICOBRA 843
#define SPECIES_SANDACONDA 844
#define SPECIES_CRAMORANT 845
#define SPECIES_ARROKUDA 846
#define SPECIES_BARRASKEWDA 847
#define SPECIES_CLOBBOPUS 852
#define SPECIES_GRAPPLOCT 853
#define SPECIES_CURSOLA 864
#define SPECIES_MR_RIME 866
#define SPECIES_MILCERY 868
#define SPECIES_ALCREMIE 869
#define SPECIES_FALINKS 870
#define SPECIES_PINCURCHIN 871
#define SPECIES_SNOM 872
#define SPECIES_FROSMOTH 873
#define SPECIES_STONJOURNER 874
#define SPECIES_EISCUE 875
#define SPECIES_INDEEDEE 876
#define SPECIES_MORPEKO 877
#define SPECIES_CUFANT 878
#define SPECIES_COPPERAJAH 879
#define SPECIES_DURALUDON 884
#define SPECIES_ZACIAN 888
#define SPECIES_ZAMAZENTA 889
#define SPECIES_ETERNATUS 890
#define SPECIES_KUBFU 891
#define SPECIES_URSHIFU 892
#define SPECIES_ZARUDE 893
#define SPECIES_REGIELEKI 894
#define SPECIES_REGIDRAGO 895
#define SPECIES_CALYREX 898

// Galarian
#define SPECIES_SLOWBRO_GALARIAN             FORMS_START + 73
#define SPECIES_WEEZING_GALARIAN             FORMS_START + 75
#define SPECIES_MR_MIME_GALARIAN             FORMS_START + 76
#define SPECIES_SLOWKING_GALARIAN            FORMS_START + 80
#define SPECIES_CORSOLA_GALARIAN             FORMS_START + 81
#define SPECIES_LINOONE_GALARIAN             FORMS_START + 83
#define SPECIES_STUNFISK_GALARIAN            FORMS_START + 87

// Cramorant
#define SPECIES_CRAMORANT_GULPING            FORMS_START + 286
#define SPECIES_CRAMORANT_GORGING            FORMS_START + 287

// Alcremie
#define SPECIES_ALCREMIE_RUBY_CREAM          FORMS_START + 291
#define SPECIES_ALCREMIE_MATCHA_CREAM        FORMS_START + 292
#define SPECIES_ALCREMIE_MINT_CREAM          FORMS_START + 293
#define SPECIES_ALCREMIE_LEMON_CREAM         FORMS_START + 294
#define SPECIES_ALCREMIE_SALTED_CREAM        FORMS_START + 295
#define SPECIES_ALCREMIE_RUBY_SWIRL          FORMS_START + 296
#define SPECIES_ALCREMIE_CARAMEL_SWIRL       FORMS_START + 297
#define SPECIES_ALCREMIE_RAINBOW_SWIRL       FORMS_START + 298

// Eiscue
#define SPECIES_EISCUE_NOICE_FACE            FORMS_START + 299

// Indeedee
#define SPECIES_INDEEDEE_FEMALE              FORMS_START + 300

// Morpeko
#define SPECIES_MORPEKO_HANGRY               FORMS_START + 301

// Zacian
#define SPECIES_ZACIAN_CROWNED_SWORD         FORMS_START + 302

// Zamazenta
#define SPECIES_ZAMAZENTA_CROWNED_SHIELD     FORMS_START + 303

// Eternatus
#define SPECIES_ETERNATUS_ETERNAMAX          FORMS_START + 304

// Urshifu
#define SPECIES_URSHIFU_RAPID_STRIKE_STYLE   FORMS_START + 305

// Zarude
#define SPECIES_ZARUDE_DADA                  FORMS_START + 306

#define MOVE_ZIPPY_ZAP 676
#define MOVE_SPLISHY_SPLASH 677
#define MOVE_FLOATY_FALL 678
#define MOVE_PIKA_PAPOW 679
#define MOVE_BOUNCY_BUBBLE 680
#define MOVE_BUZZY_BUZZ 681
#define MOVE_SIZZLY_SLIDE 682
#define MOVE_GLITZY_GLOW 683
#define MOVE_BADDY_BAD 684
#define MOVE_SAPPY_SEED 685
#define MOVE_FREEZY_FROST 686
#define MOVE_SPARKLY_SWIRL 687
#define MOVE_VEEVEE_VOLLEY 688
#define MOVE_DYNAMAX_CANNON 690
#define MOVE_STUFF_CHEEKS 693
#define MOVE_NO_RETREAT 694
#define MOVE_MAGIC_POWDER 696
#define MOVE_TEATIME 698
#define MOVE_OCTOLOCK 699
#define MOVE_COURT_CHANGE 702
#define MOVE_CLANGOROUS_SOUL 703
#define MOVE_DECORATE 705
#define MOVE_SNAP_TRAP 707
#define MOVE_BEHEMOTH_BLADE 709
#define MOVE_BEHEMOTH_BASH 710
#define MOVE_AURA_WHEEL 711
#define MOVE_LIFE_DEW 719
#define MOVE_ETERNABEAM 723
#define MOVE_METEOR_BEAM 728
#define MOVE_SHELL_SIDE_ARM 729
#define MOVE_TERRAIN_PULSE 733
#define MOVE_LASH_OUT 736
#define MOVE_CORROSIVE_GAS 738
#define MOVE_JUNGLE_HEALING 744
#define MOVE_THUNDER_CAGE 747
#define MOVE_EERIE_SPELL 754
`


window.ignore = ignoreString.match(/SPECIES_\w+|MOVE_\w+/g)