let plantGrammar =
{
    // wait :: the {plant} {waitVerb} {waitAdverb}
    "waitVerb" : ["waits", "idles", "lingers", "stands"],
    "waitAdverb" : ["patiently", "calmly", "quietly", "unwaveringly"],

    // care :: you {careVerb} the {plant} {careAdverb}
    "careVerb" : ["water", "provide sunlight for", "change the soil of", "prune"],
    "careAdverb" : ["carefully", "meticulously", "attentively", "delicately"],

    // play :: you {playVerb} the {plant} {playAdverb}
    "playVerb" : ["talk to", "sing to", "laugh with", "compliment", "smile at"],
    "playAdverb" : ["lovingly", "dearly", "playfully", "fondly", "warmly"],

    // bloom
    "plant" : ["plant", "lavender", "marigold", "daffodil", "rose", "hyacinth", "daisy", "cosmos", "tulip", "lily", "sunflower", "pansy", "poppy"]
}