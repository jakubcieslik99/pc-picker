import Joi from 'joi'

const updateValidation = Joi.object({
    type: Joi
        .string()
        .required()
        .valid(
            'case', 
            'cpu', 
            'mobo', 
            'ram', 
            'gpu', 
            'drive', 
            'psu'
        ),
    name: Joi
        .string()
        .required()
        .max(128),
    link: Joi
        .string()
        .required()
        .max(256)
        .pattern(new RegExp(/^((https?:\/\/)?)[a-zA-Z0-9]{1}[a-zA-Z0-9-.]{0,}\.[a-z]{2,13}[a-zA-Z0-9:/?#[\]@!$%&'()*+,;=\-.]{0,}$/)),
    caseCompatibility: Joi
        .string()
        .required()
        .valid(
            'atx', 
            'matx', 
            'dtx',
            'itx'
        ),
    cpuCompatibility: Joi
        .string()
        .required()
        .valid(
            'am4', 
            'am3+', 
            'am3', 
            'am2+', 
            'am2', 
            'tr4', 
            'fm2+', 
            'fm2', 
            'fm1', 
            'amd1207', 
            'amd940', 
            'amd939', 
            'amd754', 
            'amd462', 
            'lga2066', 
            'lga2011-3', 
            'lga2011', 
            'lga1366', 
            'lga1200', 
            'lga1156', 
            'lga1155', 
            'lga1151', 
            'lga1150', 
            'lga775', 
            'lga771', 
            'lga604'
        ),
    ramCompatibility: Joi
        .string()
        .required()
        .valid(
            'ddr5', 
            'ddr4', 
            'ddr3', 
            'ddr2', 
            'ddr'
        )
})

const createValidation = Joi.object({
    type: Joi
        .string()
        .required()
        .valid(
            'case', 
            'cpu', 
            'mobo', 
            'ram', 
            'gpu', 
            'drive', 
            'psu'
        ),
    name: Joi
        .string()
        .required()
        .max(128),
    link: Joi
        .string()
        .required()
        .max(256)
        .pattern(new RegExp(/^((https?:\/\/)?)[a-zA-Z0-9]{1}[a-zA-Z0-9-.]{0,}\.[a-z]{2,13}[a-zA-Z0-9:/?#[\]@!$%&'()*+,;=\-.]{0,}$/)),
    caseCompatibility: Joi
        .string()
        .required()
        .valid(
            'atx', 
            'matx', 
            'dtx',
            'itx'
        ),
    cpuCompatibility: Joi
        .string()
        .required()
        .valid(
            'am4', 
            'am3+', 
            'am3', 
            'am2+', 
            'am2', 
            'tr4', 
            'fm2+', 
            'fm2', 
            'fm1', 
            'amd1207', 
            'amd940', 
            'amd939', 
            'amd754', 
            'amd462', 
            'lga2066', 
            'lga2011-3', 
            'lga2011', 
            'lga1366', 
            'lga1200', 
            'lga1156', 
            'lga1155', 
            'lga1151', 
            'lga1150', 
            'lga775', 
            'lga771', 
            'lga604'
        ),
    ramCompatibility: Joi
        .string()
        .required()
        .valid(
            'ddr5', 
            'ddr4', 
            'ddr3', 
            'ddr2', 
            'ddr'
        )
})

const listSpecificValidation = Joi.object({
    type: Joi
        .string()
        .required()
        .valid(
            'case', 
            'cpu', 
            'mobo', 
            'ram', 
            'gpu', 
            'drive', 
            'psu'
        )
})

export {updateValidation, createValidation, listSpecificValidation}
