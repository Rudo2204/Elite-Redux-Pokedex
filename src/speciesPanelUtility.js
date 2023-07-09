const graph = document.getElementById("statsGraph")
const graphStats = [...graph.children]
const statDisplays = [...document.querySelectorAll(".statsGraphHeader")]


const speciesPanelMainContainer = document.getElementById("speciesPanelMainContainer")
const speciesPanelCloseButton = document.getElementById("speciesPanelCloseButton")
const speciesName = document.getElementById("speciesName")
const speciesID = document.getElementById("speciesID")
const speciesPanelInputSpecies = document.getElementById("speciesPanelInputSpecies")
const speciesPanelInputSpeciesDataList = document.getElementById("speciesPanelInputSpeciesDataList")
const speciesSprite = document.getElementById("speciesSprite")
const speciesType1 = document.getElementById("speciesType1")
const speciesType2 = document.getElementById("speciesType2")
const speciesType3 = document.getElementById("speciesType3")
const speciesAbilities = document.getElementById("speciesAbilities")
const speciesInnates = document.getElementById("speciesInnates")
const speciesBaseStatsGraph = document.getElementById("speciesBaseStatsGraph")
const speciesEvolutionsText = document.getElementById("speciesEvolutionsText")
const speciesEvoTable = document.getElementById("speciesEvoTable")
const speciesFormes = document.getElementById("speciesFormes")
const speciesFormesText = document.getElementById("speciesFormesText")
const speciesEggGroups = document.getElementById("speciesEggGroups")
const speciesHeldItems = document.getElementById("speciesHeldItems")
const speciesChanges = document.getElementById("speciesChanges")
const speciesHeldItemsContainer = document.getElementById("speciesHeldItemsContainer")
const speciesChangesContainer = document.getElementById("speciesChangesContainer")
const speciesTypeChart = document.getElementById("speciesTypeChart")
const speciesStrategiesContainer = document.getElementById("speciesStrategiesContainer")
const speciesStrategies = document.getElementById("speciesStrategies")
const speciesPanelLevelUpTableTbody = document.getElementById("speciesPanelLevelUpTableTbody")
const speciesPanelTMHMTableTbody = document.getElementById("speciesPanelTMHMTableTbody")
const speciesPanelTutorTableTbody = document.getElementById("speciesPanelTutorTableTbody")
const speciesPanelEggMovesTableTbody = document.getElementById("speciesPanelEggMovesTableTbody")


async function createSpeciesPanel(name){
    panelSpecies = name
    speciesPanel("show")

    const row = document.getElementById(`${name}`)

    speciesName.innerText = sanitizeString(name)
    speciesID.innerText = `#${species[name]["ID"]}`

    speciesSprite.className = `sprite${name}`
    speciesSprite.src = getSpeciesSpriteSrc(name)

    speciesType1.innerText = sanitizeString(species[name]["type1"])
    speciesType2.innerText = sanitizeString(species[name]["type2"])
    speciesType1.className = `${species[name]["type1"]} background`
    speciesType2.className = `${species[name]["type2"]} background`

    if(speciesType1.innerText === speciesType2.innerText)
        speciesType2.classList.add("hide")
    else
        speciesType2.classList.remove("hide")

    
        if(speciesHasType3(species[name]) && speciesHasType3(species[name]) !== species[name]["type1"] && speciesHasType3(species[name]) !== species[name]["type2"]){
        speciesType3.innerText = sanitizeString(speciesHasType3(species[name]))
        speciesType3.className = `${speciesHasType3(species[name])} background`
        speciesType3.classList.remove("hide")
    }
    else{
        speciesType3.classList.add("hide")
    }





    while (speciesAbilities.firstChild)
        speciesAbilities.removeChild(speciesAbilities.firstChild)

    for (let i = 0; i < species[name]["abilities"].length; i++){
        const ability = species[name]["abilities"][i]
        if(i === 1 && ability === species[name]["abilities"][0]){
            continue
        }
        else if(i === 2 && (ability === species[name]["abilities"][0] || ability === "ABILITY_NONE") && (ability === species[name]["abilities"][1] || ability === "ABILITY_NONE")){
            continue
        }
        if(species[name]["abilities"][i] !== "ABILITY_NONE"){
            const abilityContainer = document.createElement("div")
            const abilityName = document.createElement("span")
            const abilityDescription = document.createElement("span")

            abilityName.innerText = abilities[ability]["ingameName"]
            abilityDescription.innerText = abilities[ability]["description"]

            if(i === 2)
                abilityName.className = "bold"
            else
                abilityName.className = "italic"

            abilityDescription.className = "speciesPanelAbilitiesDescriptionPadding"
            abilityContainer.className = "flex wrap"

            abilityContainer.append(abilityName)
            abilityContainer.append(abilityDescription)
            speciesAbilities.append(abilityContainer)
        }
    }


    while (speciesInnates.firstChild)
        speciesInnates.removeChild(speciesInnates.firstChild)

    for (let i = 0; i < species[name]["innates"].length; i++){
        const ability = species[name]["innates"][i]
        if(species[name]["innates"][i] !== "ABILITY_NONE"){
            const abilityContainer = document.createElement("div")
            const abilityName = document.createElement("span")
            const abilityDescription = document.createElement("span")

            abilityName.innerText = abilities[ability]["ingameName"]
            abilityDescription.innerText = abilities[ability]["description"]

            abilityName.className = "italic"

            abilityDescription.className = "speciesPanelAbilitiesDescriptionPadding"
            abilityContainer.className = "flex wrap"

            abilityContainer.append(abilityName)
            abilityContainer.append(abilityDescription)
            speciesInnates.append(abilityContainer)
        }
    }
    






    let monStats = [species[name]["baseHP"], 
    species[name]["baseAttack"], 
    species[name]["baseDefense"], 
    species[name]["baseSpAttack"], 
    species[name]["baseSpDefense"], 
    species[name]["baseSpeed"],
    species[name]["BST"]]

    
    graphStats.forEach ((stat, index) => {
        statDisplays[index].innerText = monStats[index]

        if(index !== 6){
            stat.style.width = `${(monStats[index] / 255) * graph.offsetWidth}px`
            stat.style.background = `hsl(${monStats[index]*0.7},85%,45%)`
        }
        else{
            stat.style.width = `${(monStats[index] / 255) * graph.offsetWidth/6}px`
            stat.style.background = `hsl(${(monStats[index]*1)/6},85%,45%)`   
        }
    })



    while(speciesEvoTable.firstChild){
        speciesEvoTable.removeChild(speciesEvoTable.firstChild)
    }

    if(species[name]["evolutionLine"].length > 1){
        speciesEvolutionsText.classList.remove("hide")
        let speciesArray = [species[name]["evolutionLine"][0]]
        let targetSpeciesArray = []
        const rootContainer = document.createElement("td")
        rootContainer.append(createClickableImgAndName(species[name]["evolutionLine"][0], false, false, false))
        speciesEvoTable.append(rootContainer)

        mainLoop: while(speciesArray.length > 0){

            let speciesEvoTableContainer = document.createElement("td")

            for(let i = 0; i < speciesArray.length; i++){
                const targetSpecies = speciesArray[i]
                for(let j = 0; j < species[targetSpecies]["evolution"].length; j++){
                    if(species[targetSpecies]["evolutionLine"].indexOf(targetSpecies) >= species[targetSpecies]["evolutionLine"].indexOf(species[targetSpecies]["evolution"][j][2])){ // prevent infinite loop (dialga)
                        break mainLoop
                    }
                    speciesEvoTableContainer.append(createClickableImgAndName(species[targetSpecies]["evolution"][j][2], species[targetSpecies]["evolution"][j], false, false))
                    speciesEvoTable.append(speciesEvoTableContainer)

                    targetSpeciesArray.push(species[targetSpecies]["evolution"][j][2])
                }
            }

            targetSpeciesArray =  Array.from(new Set(targetSpeciesArray))

            speciesArray = targetSpeciesArray
            targetSpeciesArray = []
        }
    }
    else{
        speciesEvolutionsText.classList.add("hide")
    }

    speciesEvoTable.style.display = "ruby"
    speciesEvoTable.className = ""

    if(speciesEvoTable.offsetWidth > 525){
        speciesEvoTable.classList.add("resizeEvo1")
    }
    if(speciesEvoTable.offsetWidth > 400){
        speciesEvoTable.classList.add("resizeEvo2")
    }
    if(speciesEvoTable.offsetWidth > 350){
        speciesEvoTable.classList.add("resizeEvo3")
    }





    while (speciesFormes.firstChild)
        speciesFormes.removeChild(speciesFormes.firstChild)


    if(species[name]["forms"].length <= 1)
        speciesFormesText.classList.add("hide")
    else
        speciesFormesText.classList.remove("hide")

    if(species[name]["forms"].length > 1){
        for (let i = 0; i < species[name]["forms"].length; i++){
            if(!ignore.includes(species[name]["forms"][i])){
                speciesFormes.append(createClickableImgAndName(species[name]["forms"][i]))
            }
        }
    }













    while (speciesEggGroups.firstChild) 
        speciesEggGroups.removeChild(speciesEggGroups.firstChild)
    while (speciesHeldItems.firstChild)
        speciesHeldItems.removeChild(speciesHeldItems.firstChild)
    while (speciesChanges.firstChild)
        speciesChanges.removeChild(speciesChanges.firstChild)



    const eggGroup1 = document.createElement("div")
    const eggGroup2 = document.createElement("div")
    eggGroup1.innerText = sanitizeString(species[name]["eggGroup1"])
    eggGroup2.innerText = sanitizeString(species[name]["eggGroup2"])
    speciesEggGroups.append(eggGroup1)
    if(species[name]["eggGroup1"] !== species[name]["eggGroup2"])
        speciesEggGroups.append(eggGroup2)








    if(species[name]["item1"] !== ""){
        const heldItem1 = document.createElement("div")
        heldItem1.innerText = `50% ${sanitizeString(species[name]["item1"])}`
        speciesHeldItems.append(heldItem1)
    }
    if(species[name]["item2"] !== ""){
        const heldItem2 = document.createElement("div")
        heldItem2.innerText = `5% ${sanitizeString(species[name]["item2"])}`
        speciesHeldItems.append(heldItem2)
    }

    if(speciesHeldItems.firstChild)
        speciesHeldItemsContainer.classList.remove("hide")
    else
        speciesHeldItemsContainer.classList.add("hide")








    if(species[name]["changes"].length !== 0){
        for (let i = 0; i < species[name]["changes"].length; i++){
            const stat = species[name]["changes"][i][0]
            const oldStat = species[name]["changes"][i][1]
            const newStat = species[name][stat]
            createChange(stat, oldStat, newStat, name, speciesChanges)
        }
    }
    if(speciesChanges.firstChild)
        speciesChangesContainer.classList.remove("hide")
    else
        speciesChangesContainer.classList.add("hide")






    while (speciesTypeChart.firstChild)
        speciesTypeChart.removeChild(speciesTypeChart.firstChild)

    Object.keys(typeChart).forEach(type => {
        const typeEffectivenessContainer = document.createElement("span")
        const checkType = document.createElement("span")
        const typeEffectivenessValue = document.createElement("span")
        typeEffectivenessContainer.className = "flex flexCenter flexColumn speciesTypeChartMarginTop"
        checkType.innerText = sanitizeString(type)
        checkType.className = `background2 ${type}`
        if((species[name]["type1"] !== species[name]["type2"]) && species[name]["type2"] !== undefined){
            if(speciesHasType3(species[name]) && speciesHasType3(species[name]) !== species[name]["type1"] && speciesHasType3(species[name]) !== species[name]["type2"]){
                typeEffectivenessValue.innerText = typeChart[type][species[name]["type1"]]*typeChart[type][species[name]["type2"]]*typeChart[type][speciesHasType3(species[name])]
            }
            else{
                typeEffectivenessValue.innerText = typeChart[type][species[name]["type1"]]*typeChart[type][species[name]["type2"]]
            }
        }
        else{
            if(speciesHasType3(species[name]) && speciesHasType3(species[name]) !== species[name]["type1"] && speciesHasType3(species[name]) !== species[name]["type2"]){
                typeEffectivenessValue.innerText = typeChart[type][species[name]["type1"]]*typeChart[type][speciesHasType3(species[name])]
            }
            else{
                typeEffectivenessValue.innerText = typeChart[type][species[name]["type1"]]
            }
        }
        typeEffectivenessValue.className = `typeChart${typeEffectivenessValue.innerText} background3`
        typeEffectivenessContainer.append(checkType)
        typeEffectivenessContainer.append(typeEffectivenessValue)
        speciesTypeChart.append(typeEffectivenessContainer)
    })







    
    if(strategies[name]){
        speciesStrategiesContainer.classList.remove("hide")
        while(speciesStrategies.firstChild){
            speciesStrategies.removeChild(speciesStrategies.firstChild)
        }
        for(let i = 0; i < strategies[name].length; i++){
            speciesStrategies.append(createSpeciesStrategy(strategies[name][i], name))
        }
    }
    else{
        speciesStrategiesContainer.classList.add("hide")
    }

    









    while(speciesPanelLevelUpTableTbody.firstChild)
        speciesPanelLevelUpTableTbody.removeChild(speciesPanelLevelUpTableTbody.firstChild)
    buildSpeciesPanelLearnsetsTable(speciesPanelLevelUpTableTbody, name, "levelUpLearnsets")

    while(speciesPanelTMHMTableTbody.firstChild)
        speciesPanelTMHMTableTbody.removeChild(speciesPanelTMHMTableTbody.firstChild)
    buildSpeciesPanelLearnsetsTable(speciesPanelTMHMTableTbody, name, "TMHMLearnsets")

    while(speciesPanelTutorTableTbody.firstChild)
        speciesPanelTutorTableTbody.removeChild(speciesPanelTutorTableTbody.firstChild)
    buildSpeciesPanelEggMovesTable(speciesPanelTutorTableTbody, name, "tutorLearnsets")

    while(speciesPanelEggMovesTableTbody.firstChild)
        speciesPanelEggMovesTableTbody.removeChild(speciesPanelEggMovesTableTbody.firstChild)
    buildSpeciesPanelEggMovesTable(speciesPanelEggMovesTableTbody, name, "eggMovesLearnsets")

}



speciesPanelInputSpecies.addEventListener("input", e => {
    const value = e.target.value
    if(speciesIngameNameArray.includes(value)){
        const species = `SPECIES_${value.replaceAll(" ", "_").toUpperCase()}`
        createSpeciesPanel(species)
        window.scrollTo(0, 0)
        speciesPanelInputSpecies.blur()
        speciesPanelInputSpecies.value = ""
    }
})






function createClickableImgAndName(speciesName, evoConditions = false, showName = true, miniSprite = true){
    const container = document.createElement("div")
    const sprite = document.createElement("img")
    const name = document.createElement("span")

    container.className = "flexCenter flex flexRow hover"

    sprite.src = getSpeciesSpriteSrc(speciesName)
    sprite.className = `sprite${speciesName}`
    if(miniSprite){
        sprite.classList.add("miniSprite")
    }
    else{
        sprite.classList.add("miniSprite3")
    }

    if(evoConditions){
        const evoCondition = document.createElement("span")
        if(evoConditions[0] !== "EVO_MEGA_EVOLUTION"){
            evoCondition.innerText = `${sanitizeString(evoConditions[0])} (${sanitizeString(evoConditions[1])})`
        }
        else{
            evoCondition.innerText = `Mega`
        }
        evoCondition.innerText += ` ➝ `
        evoCondition.className = "evoMethod"
        container.append(evoCondition)
    }
    if(showName){
        name.innerText = sanitizeString(species[speciesName]["name"])
        name.className = "underline"
    }

    container.append(sprite)
    container.append(name)

    container.addEventListener("click", () => {
        createSpeciesPanel(speciesName)
    })

    return container
}






function createChange(stat, oldStat = [""], newStat = [""], speciesName, obj){
    if(typeof newStat == "object"){
        for (let i = 0; i < newStat.length; i++){
            const changeMainContainer = document.createElement("div")
            const changeContainer = document.createElement("span")
            const statContainer = document.createElement("span")
            const oldStatContainer = document.createElement("span")
            const newStatContainer = document.createElement("span")

            statContainer.innerText = replaceStatString(`${stat}${i}`)


            if(newStat[i] !== oldStat[i]){
                if(oldStat[i] in abilities){
                    oldStatContainer.innerText = abilities[oldStat[i]]["ingameName"]
                }
                else{
                    oldStatContainer.innerText = `${sanitizeString(oldStat[i])}`
                }
                if(newStat[i] in abilities){
                    newStatContainer.innerText = abilities[newStat[i]]["ingameName"]
                }
                else{
                    newStatContainer.innerText = `${sanitizeString(newStat[i])}`
                }
                appendChangesToObj(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer, obj)   
            }


        }
    }
    else if(newStat !== oldStat){
        const changeMainContainer = document.createElement("div")
        const changeContainer = document.createElement("span")
        const statContainer = document.createElement("span")
        const oldStatContainer = document.createElement("span")
        const newStatContainer = document.createElement("span")
        statContainer.innerText = replaceStatString(stat)
        oldStatContainer.innerText = `${sanitizeString(oldStat)}`
        newStatContainer.innerText = `${sanitizeString(newStat)}`
        if(!isNaN(newStat)){
            if(newStat > oldStat){
                changeContainer.classList.add("buff")
            }
            else{
                changeContainer.classList.add("nerf")
            }
        }
        else if(stat === "type1" || stat === "type2"){
            oldStatContainer.className = `${oldStat} background2`
            newStatContainer.className = `${newStat} background2`
        }
        appendChangesToObj(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer, obj)   
    }
}



function appendChangesToObj(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer, obj){
    changeMainContainer.className = "flex flexAlign"
    changeContainer.classList.add("textAlign")
    changeContainer.classList.add("changeTextAlignFlex")
    statContainer.classList.add("speciesPanelStatPadding")
    oldStatContainer.classList.add("reduceOpacity")
    newStatContainer.classList.add("bold")

    const changeContainerTransition = document.createElement("span")
    changeContainerTransition.innerText = " ➝ "

    changeContainer.append(oldStatContainer, changeContainerTransition, newStatContainer)

    changeMainContainer.append(statContainer, changeContainer)
    obj.append(changeMainContainer)
}









function replaceStatString(stat){
    const replaceStringObject = {
        "type1": "Type 1",
        "type2": "Type 2",
        "eggGroup1": "Egg Group 1",
        "eggGroup2": "Egg Group 2",
        "abilities": "Ability",
        "abilities0": "Ability 1",
        "abilities1": "Ability 2",
        "abilities2": "HA",
        "baseHP": "HP",
        "baseAttack": "Atk",
        "baseDefense": "Def",
        "baseSpAttack": "SpA",
        "baseSpDefense": "SpD",
        "baseSpeed": "Spe",
    }
    if(stat in replaceStringObject){
        return replaceStringObject[stat]
    }
    else{
        return stat
    }
}










function createSpeciesStrategy(strategy, speciesName){
    const strategyContainer = document.createElement("div")
    const strategyName = document.createElement("h3"); strategyName.className = "strategyName"
    const strategySpriteContainer = document.createElement("span"); strategySpriteContainer.className = "strategySpriteContainer"
    const strategySprite = document.createElement("img"); strategySprite.className = `miniSprite sprite${speciesName} strategySprite`
    const strategyTagsContainer = document.createElement("div"); strategyTagsContainer.className = "strategyTagsContainer"
    const strategyInfo = document.createElement("div"); strategyInfo.className = "strategyInfo"
    const strategyMoves = document.createElement("div"); strategyMoves.className = "strategyTableContainer"
    const strategyMovesTable = document.createElement("table"); strategyMovesTable.className = "strategyTable"
    const strategyMovesTbody = document.createElement("Tbody")
    const strategyMisc = document.createElement("div"); strategyMisc.className = "strategyTableContainer"
    const strategyMiscTable = document.createElement("table"); strategyMiscTable.className = "strategyTable"
    const strategyMiscTbody = document.createElement("Tbody")
    const strategyCommentContainer = document.createElement("div"); strategyCommentContainer.className = "strategyCommentContainer"
    
    strategyName.innerText = strategy["name"]
    strategySpriteContainer.append(strategySprite)
    strategySprite.src = sprites[speciesName]
    strategySpriteContainer.append(strategyName)
    strategyContainer.append(strategySpriteContainer)
    strategyContainer.append(strategyTagsContainer)

    for(let i = 0; i < strategy["tags"].length; i++){
        strategyTagsContainer.append(createStrategyTags(sanitizeString(strategy["tags"][i].trim())))
    }

    strategyMoves.append(strategyMovesTable)
    strategyMovesTable.append(strategyMovesTbody)
    strategyMisc.append(strategyMiscTable)
    strategyMiscTable.append(strategyMiscTbody)

    for(let i = 0; i < strategy["moves"].length; i++){
        strategyMovesTbody.append(createStrategyMove(i, strategy["moves"][i]))
    }
    strategyMiscTbody.append(createStrategyMisc("Item", strategy["item"], speciesName))
    strategyMiscTbody.append(createStrategyMisc("Ability", strategy["ability"], speciesName))
    strategyMiscTbody.append(createStrategyMisc("Nature", strategy["nature"], speciesName))
    strategyMiscTbody.append(createStrategyMisc("EVs", strategy["evs"], speciesName))

    for(let i = 0; i < strategy["comment"].length; i++){
        const strategyComment = document.createElement("div")
        if(strategy["comment"][i] === ""){
            strategyComment.append(document.createElement("br"))
        }
        else{
            strategyComment.innerText = strategy["comment"][i]
        }
        strategyCommentContainer.append(strategyComment)
    }

    strategyInfo.append(strategyMoves)
    strategyInfo.append(strategyMisc)
    strategyInfo.append(strategyCommentContainer)
    strategyContainer.append(strategyInfo)
    

    return strategyContainer
}






function createStrategyTags(tag){
    const strategyTag = document.createElement("span"); strategyTag.className = "strategyTag"

    if(tag === "Defensive"){
        strategyTag.innerText = "🛡️ Defensive"
    }
    else if(tag === "Offensive"){
        strategyTag.innerText = "⚔️ Offensive"
    }
    else if(tag === "Singles"){
        strategyTag.innerText = "1️⃣ Singles"
    }
    else if(tag === "Doubles"){
        strategyTag.innerText = "2️⃣ Singles"
    }
    else if(tag === "Mixed"){
        strategyTag.innerText = "⛈️ Singles"
    }
    else if(tag === "Troll"){
        strategyTag.innerText = "🤣 Singles"
    }
    else{
        strategyTag.innerText = tag
    }

    return strategyTag
}









function createStrategyMove(num, move){
    const moveContainer = document.createElement("tr"); moveContainer.className = "strategyTr"
    const moveNum = document.createElement("td"); moveNum.className = "strategyLabel"
    const moveName = document.createElement("td"); moveName.className = "strategyData"

    moveNum.innerText = `Move ${num + 1}:`
    if(/\//.test(move)){
        moveName.innerText = move.trim()
    }
    else{
        moveName.innerText = sanitizeString(move)
    }
    moveContainer.append(moveNum)
    moveContainer.append(moveName)
    return moveContainer
}







function createStrategyMisc(label, value, speciesName){
    const miscContainer = document.createElement("tr"); miscContainer.className = "strategyTr"
    const miscLabel = document.createElement("td"); miscLabel.className = "strategyLabel"
    const miscValue = document.createElement("td"); miscValue.className = "strategyData"

    miscLabel.innerText = `${label}:`
    if(label === "EVs"){
        for(let i = 0; i < value.length; i++){
            if(value[i] > 0){
                if(!miscValue.innerText == ""){
                    miscValue.innerText += " / "
                }
                if(i === 0)
                    miscValue.innerText += `${value[i]} HP`
                else if(i === 1)
                    miscValue.innerText += `${value[i]} Atk`
                else if(i === 2)
                    miscValue.innerText += `${value[i]} Def`
                else if(i === 3)
                    miscValue.innerText += `${value[i]} SpA`
                else if(i === 4)
                    miscValue.innerText += `${value[i]} SpD`
                else if(i === 5)
                    miscValue.innerText += `${value[i]} Spe`
            }
        }
    }
    else{
        miscValue.innerText = sanitizeString(value)
    }
    miscContainer.append(miscLabel)
    miscContainer.append(miscValue)
    return miscContainer
}
























function buildSpeciesPanelLearnsetsTable(Tbody, name, input){
    for (let i = 0; i < species[name][input].length; i++){
        const row = document.createElement("tr")

        const level = document.createElement("td")
        level.innerText = species[name][input][i][1]
        row.append(level)

        const moveName = document.createElement("td")
        moveName.innerText = moves[species[name][input][i][0]]["ingameName"]
        moveName.className = "bold"
        row.append(moveName)

        const typeContainer = document.createElement("td")
        const type = document.createElement("div")
        type.innerText = sanitizeString(moves[species[name][input][i][0]]["type"])
        type.className = `${moves[species[name][input][i][0]]["type"]} background`
        typeContainer.append(type)
        row.append(typeContainer)

        const splitContainer = document.createElement("td")
        const splitIcon = document.createElement("img")
        splitIcon.src = `src/moves/${moves[species[name][input][i][0]]["split"]}.png`
        splitIcon.className = `${sanitizeString(moves[species[name][input][i][0]]["split"])} splitIcon`
        splitContainer.append(splitIcon)
        row.append(splitContainer)

        const power = document.createElement("td")
        power.className = "speciesPanelLearnsetsPower"
        if(moves[species[name][input][i][0]]["power"] != 0){
            power.innerText = moves[species[name][input][i][0]]["power"]
        }
        else{
            power.innerText = "-"   
        }
        row.append(power)

        const accuracy = document.createElement("td")
        accuracy.className = "speciesPanelLearnsetsAccuracy"
        if(moves[species[name][input][i][0]]["accuracy"] != 0){
            accuracy.innerText = moves[species[name][input][i][0]]["accuracy"]
        }
        else{
            accuracy.innerText = "-"   
        }
        row.append(accuracy)

        const PP = document.createElement("td")
        PP.className = "speciesPanelLearnsetsPP"
        PP.innerText = moves[species[name][input][i][0]]["PP"]
        row.append(PP)

        const description = document.createElement("td")
        description.className = "speciesPanelLearnsetsEffect"
        for (let j = 0; j < moves[species[name][input][i][0]]["description"].length; j++){
            description.innerText += moves[species[name][input][i][0]]["description"][j].replace("\\n", " ")
        }
        row.append(description)

        Tbody.append(row)
    }
}


function buildSpeciesPanelEggMovesTable(Tbody, name, input){
    for (let i = 0; i < species[name][input].length; i++){
        const row = document.createElement("tr")

        const moveName = document.createElement("td")
        moveName.innerText = moves[species[name][input][i]]["ingameName"]
        moveName.className = "bold"
        row.append(moveName)

        const typeContainer = document.createElement("td")
        const type = document.createElement("div")
        type.innerText = sanitizeString(moves[species[name][input][i]]["type"])
        type.className = `${moves[species[name][input][i]]["type"]} background`
        typeContainer.append(type)
        row.append(typeContainer)

        const splitContainer = document.createElement("td")
        const splitIcon = document.createElement("img")
        splitIcon.src = `src/moves/${moves[species[name][input][i]]["split"]}.png`
        splitIcon.className = `${sanitizeString(moves[species[name][input][i]]["split"])} splitIcon`
        splitContainer.append(splitIcon)
        row.append(splitContainer)

        const power = document.createElement("td")
        power.className = "speciesPanelLearnsetsPower"
        if(moves[species[name][input][i]]["power"] != 0){
            power.innerText = moves[species[name][input][i]]["power"]
        }
        else{
            power.innerText = "-"   
        }
        row.append(power)

        const accuracy = document.createElement("td")
        accuracy.className = "speciesPanelLearnsetsAccuracy"
        if(moves[species[name][input][i]]["accuracy"] != 0){
            accuracy.innerText = moves[species[name][input][i]]["accuracy"]
        }
        else{
            accuracy.innerText = "-"   
        }
        row.append(accuracy)

        const PP = document.createElement("td")
        PP.className = "speciesPanelLearnsetsPP"
        PP.innerText = moves[species[name][input][i]]["PP"]
        row.append(PP)

        const description = document.createElement("td")
        description.className = "speciesPanelLearnsetsEffect"
        for (let j = 0; j < moves[species[name][input][i]]["description"].length; j++){
            description.innerText += moves[species[name][input][i]]["description"][j].replace("\\n", " ")
        }
        row.append(description)

        Tbody.append(row)
    }
}





speciesPanelCloseButton.addEventListener("click", () => {
    speciesPanel("hide")
})

async function speciesPanel(param){
    if(param === "hide"){
        speciesPanelMainContainer.classList.add("hide")
    }
    else if(param === "show"){
        speciesPanelMainContainer.classList.remove("hide")
    }
    else{
        speciesPanelMainContainer.classList.toggle("hide")
    }
    refreshURLParams()
}