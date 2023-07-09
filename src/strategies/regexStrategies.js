async function regexStrategies(textStrategies, strategies){
    const lines = textStrategies.split("\n")
    let name = null, inBracket = false

    lines.forEach(line => {
        line = line.trim()

        if(line === "{"){
            if(name){
                inBracket = true
                createAndInitializeSetForSpecies(strategies, name)
            }
        }
        else if(line === "}," || line === "}"){
            inBracket = false
            name = null
        }
        else if(!inBracket){
            matchSpecies = line.match(/SPECIES_\w+/i)
            if(matchSpecies){
                name = matchSpecies[0]
            }
            else if(`SPECIES_${line.toUpperCase().replaceAll(" ", "_")}` in species){
                name = `SPECIES_${line.toUpperCase().replaceAll(" ", "_")}`
            }
        }
        else if(inBracket){
                
            const i = strategies[name].length - 1

            if(/name *=/i.test(line)){
                strategies[name][i]["name"] = line.match(/= *(.*)$/)[1].trim() // regex is fun
            }
            else if(/item *=/i.test(line)){
                if(/ITEM_\w+/i.test(line)){
                    strategies[name][i]["item"] = line.match(/ITEM_\w+/i)[0]
                }
                else{
                    strategies[name][i]["item"] = line.match(/= *(.*)/i)[1]
                }
            }
            if(/ability *=/i.test(line)){
                if(/= *\d+/i.test(line)){
                    strategies[name][i]["ability"] = species[name]["abilities"][parseInt(line.match(/\d+/)[0])]
                }
                else{
                    strategies[name][i]["ability"] = line.match(/= *(.*)/i)[1]
                }
            }
            if(/evs *=/i.test(line)){
                strategies[name][i]["evs"] = line.match(/\d+/g)
            }
            if(/nature *=/i.test(line)){
                if(/ITEM_\w+/i.test(line)){
                    strategies[name][i]["nature"] = line.match(/NATURE_\w+/i)[0]
                }
                else{
                    strategies[name][i]["nature"] = line.match(/= *(.*)/i)[1]
                }
            }
            if(/moves *=/i.test(line)){
                if(/MOVE_\w+/i.test(line)){
                    strategies[name][i]["moves"] = line.match(/MOVE_\w+/gi)
                }
                else{
                    strategies[name][i]["moves"] = line.match(/= *(.*)/i)[1].split(",")
                }
            }
        }
        /*
        else if(name){
            if(line !== ""){
                strategies[name]["overview"] += line
            }
        }
        */
    })

    return strategies
}



function createAndInitializeSetForSpecies(strategies, name){
    if(!strategies[name]){
        strategies[name] = []
        //strategies[name]["overview"] = ""
    }

    strategies[name].push({})

    const i = strategies[name].length - 1

    strategies[name][i]["name"] = ""
    strategies[name][i]["item"] = ""
    strategies[name][i]["ability"] = 0
    strategies[name][i]["evs"] = []
    strategies[name][i]["nature"] = ""
    strategies[name][i]["moves"] = []
    strategies[name][i]["comment"] = ""
}