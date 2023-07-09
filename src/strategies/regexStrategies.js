async function regexStrategies(textStrategies, strategies){
    const lines = textStrategies.split("\n")
    let name = null, inBracket = false
    const regex = /.name|.heldItem|.ability|.evs|.nature|.moves|.comment/i

    lines.forEach(line => {
        line = line.trim()

        if(!inBracket){
            matchSpecies = line.match(/SPECIES_\w+/i)
            if(matchSpecies){
                name = matchSpecies[0]
            }
            else if(`SPECIES_${line.toUpperCase().replaceAll(" ", "_")}` in species){
                console.log(line)
            }
        }

        else if(line === "{"){
            inBracket = true
            createAndInitializeSetForSpecies(strategies, name)
        }
        else if(line === "}," || line === "}"){
            inBracket = false
            name = null
        }

        else if(inBracket){
            matchRegex = line.match(regex)
            if(matchRegex){
                const match = matchRegex[0]
                
                const i = strategies[name].length - 1

                if(match === ".evs"){
                    strategies[name][i]["evs"] = line.match(/\d+/g)
                }
                else if(match === ".ability"){
                    strategies[name][i]["ability"] = parseInt(line.match(/\d+/)[0])
                }
                else if(match === ".name"){
                    strategies[name][i]["name"] = line.match(/= *(.*)$/)[1].trim() // regex is fun
                }
                else if(match === ".heldItem"){
                    strategies[name][i]["item"] = line.match(/ITEM_\w+/i)[0]
                }
                else if(match === ".nature"){
                    strategies[name][i]["nature"] = line.match(/NATURE_\w+/i)[0]
                }
                else if(match === ".moves"){
                    strategies[name][i]["moves"] = line.match(/MOVE_\w+/gi)
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