const removeLeadingNonWordChars = (text) => {
    text = text.replace(/^\W+/g, '')
    return text
}

const removeNonWordCharsBeforeSentenceDelimiters = (text) => {
    text = text.replace(/(\W+)([.?!])/g, '$2')
    return text
}

const forceMonoSpacing = (text) => {     // <Text.Text    text  ?> => <Text. Text text?>
    text = text.replace(/([^\w\s']\b)/g, '$1 ')
    text = text.replace(/\s(?!\b)/g, '')
    return text
}

const forceFirstCharOfSentenceToUpperCase = (text) => {
    text = text.replace(/(?<=^|[.?!]\s)(.)/g, firstCharacter => firstCharacter.toUpperCase())
    return text
}

const removeNonWordCharsExceptSingleSpaceAtSentenceBoundaries = (text) => {
    text = text.replace(/(?<=[.?!])\W+(?=\s\b)/g, '')
    return text
}

export const formatText = (text) => {
    text = text.trim()

    text = removeLeadingNonWordChars(text)
    text = forceMonoSpacing(text)
    text = forceFirstCharOfSentenceToUpperCase(text)
    text = removeNonWordCharsBeforeSentenceDelimiters(text)
    text = removeNonWordCharsExceptSingleSpaceAtSentenceBoundaries(text)

    return text;
}