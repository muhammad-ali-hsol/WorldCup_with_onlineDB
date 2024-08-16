const { Op, and } = require("sequelize");
const { IdentityModel } = require("../models/identity");
const { MatchModel } = require("../models/match");
const { matchSchema, helpingFunctionToCheckIdIsNumberandPositive } = require('../middleware/worldcupJoiValidation');


const createMatch = async (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(404).json("Data does not exist");
    }

    // JOI validation
    const validationFailed = helpingFunctionMatchSchemaValidate(data);
    if (validationFailed) {
        return res.status(403).json(validationFailed);
    }

    // I make sure this case is handled at frontend so its only as additional check

    if (data.team1 === data.team2) {
        return res.status(400).json("Team IDs are the same");
    }
    if (data.umpire1 === data.umpire2) {
        return res.status(400).json("Umpire IDs are the same");
    }

    try {
        const isConflict = await MatchModel.findOne({
            where: {
                [Op.and]: [
                    { date: data.date },
                    {
                        [Op.or]: [
                            { team1: data.team1 },
                            { team2: data.team2 },
                            { team1: data.team2 },
                            { team2: data.team1 },
                            { umpire1: data.umpire1 },
                            { umpire2: data.umpire2 },
                            { umpire1: data.umpire2 },
                            { umpire2: data.umpire1 },
                            { venue: data.venue }
                        ]
                    }
                ]
            }
        });

        // Handle conflicts

        if (isConflict) {
            let messages = [];
            let message = '';
            if (isConflict.team1 == data.team1 || isConflict.team2 == data.team1) {
                message = `Team 1 already has a match on ${data.date}`;
                messages.push(message);
            }
            if (isConflict.team1 === data.team2 || isConflict.team2 === data.team2) {
                message = `Team 2 already has a match on ${data.date}`;
                messages.push(message);
            }
            if (isConflict.umpire1 == data.umpire1 || isConflict.umpire2 == data.umpire1) {
                message = `Umpire 1 already has a match on ${data.date}`;
                messages.push(message);
            }
            if (isConflict.umpire2 == data.umpire1 || isConflict.umpire2 == data.umpire2) {
                message = `Umpire 2 already has a match on ${data.date}`;
                messages.push(message);
            }
            if (isConflict.venue == data.venue) {
                message = `Venue is already reserved for a match on ${data.date}`
                messages.push(message);
            }
            return res.status(409).json({ messages });
        }

        // Create the match
        const createdMatch = await MatchModel.create(data);
        if (createdMatch) {
            return res.status(201).json({ status: "Match has been created" });
        }
        else {
            return res.status(400).json({ message: "Error in Creating Match" });
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const searchMatchByTeamId = async (req, res) => {
    const { teamId } = req.params;

    //Joi validation
    const teamIdValidationFail = helpingFunctionToCheckIdIsNumberandPositive('Team', teamId);
    if (teamIdValidationFail) {
        return res.status(403).json(teamIdValidationFail);
    }
    try {
        const isMatchesExist = await MatchModel.findAll({
            attributes: ['id', 'matchName', 'date', 'time'],
            where: {
                [Op.or]:
                    [
                        { team1: teamId },
                        { team2: teamId }
                    ]

            },
            include: [
                {
                    model: IdentityModel,
                    as: 'team1Detail',
                    attributes: ['id', 'identityName']
                },
                {
                    model: IdentityModel,
                    as: 'team2Detail',
                    attributes: ['id', 'identityName']
                },
                {
                    model: IdentityModel,
                    as: 'venueDetail',
                    attributes: ['id', 'identityName', 'imageURL']
                },
            ]
        })
        if (isMatchesExist) {
            return res.status(200).json(isMatchesExist);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

const getAllMatches = async (req, res) => {

    try {
        const isMatchesExist = await MatchModel.findAll({
            attributes: ['id', 'matchName', 'date', 'time'],
            include: [
                {
                    model: IdentityModel,
                    as: 'team1Detail',
                    attributes: ['id', 'identityName']
                },
                {
                    model: IdentityModel,
                    as: 'team2Detail',
                    attributes: ['id', 'identityName']
                },
                {
                    model: IdentityModel,
                    as: 'venueDetail',
                    attributes: ['id', 'identityName', 'imageURL']
                },
                {
                    model: IdentityModel,
                    as: 'umpire1Detail',
                    attributes: ['id', 'identityName']
                },
                {
                    model: IdentityModel,
                    as: 'umpire2Detail',
                    attributes: ['id', 'identityName']
                },
            ]
        })
        if (isMatchesExist) {
            return res.status(200).json(isMatchesExist);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }


}

const searchMatchByMatchId = async (req, res) => {
    const { matchId } = req.params;

    //Joi validation
    const matchIdValidationFail = helpingFunctionToCheckIdIsNumberandPositive('Match', matchId);
    if (matchIdValidationFail) {
        return res.status(403).json(matchIdValidationFail);
    }

    try {
        const match = await MatchModel.findOne({
            attributes: ['id', 'matchName', 'date', 'time'],
            where: { id: matchId },
            include: [
                {
                    model: IdentityModel,
                    as: 'team1Detail',
                    attributes: ['id', 'identityName', 'imageURL'],
                    include: [
                        {
                            model: IdentityModel,
                            as: 'players',
                            attributes: ['id', 'identityName', 'imageURL']
                        }
                    ]
                },
                {
                    model: IdentityModel,
                    as: 'team2Detail',
                    attributes: ['id', 'identityName', 'imageURL'],
                    include: [
                        {
                            model: IdentityModel,
                            as: 'players',
                            attributes: ['id', 'identityName', 'imageURL']
                        }
                    ]
                },
                {
                    model: IdentityModel,
                    as: 'umpire1Detail',
                    attributes: ['id', 'identityName', 'imageURL'],
                },
                {
                    model: IdentityModel,
                    as: 'umpire2Detail',
                    attributes: ['id', 'identityName', 'imageURL'],
                },
                {
                    model: IdentityModel,
                    as: 'venueDetail',
                    attributes: ['id', 'identityName', 'imageURL'],
                }
            ]
        });

        if (match) {
            return res.status(200).json(match);
        }
        else {
            return res.status(404).json(`Match with ID:${matchId} does not exist`);
        }


    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const updateMatch = async (req, res) => {
    const { matchId } = req.params;

    //Joi validation
    const matchIdValidationFail = helpingFunctionToCheckIdIsNumberandPositive('Match', matchId);
    if (matchIdValidationFail) {
        return res.status(403).json(matchIdValidationFail);
    }

    const data = req.body;
    if (!data) {
        return res.status(404).json("Data for updation is not provided");
    }
    // JOI validation
    const validationFailed = helpingFunctionMatchSchemaValidate(data);
    if (validationFailed) {
        return res.status(403).json(validationFailed);
    }

    // I add this for additional check
    if (!data.umpire1 || !data.umpire2) {
        return res.status(404).json("Umpire IDs are not provided");
    }
    if (!data.venue) {
        return res.status(404).json("Venue ID is not provided");
    }
    try {

        const isConflict = await MatchModel.findOne({
            where: {
                id: { [Op.ne]: matchId },
                [Op.and]: [
                    { date: data.date },
                    {
                        [Op.or]: [
                            { umpire1: data.umpire1 },
                            { umpire2: data.umpire2 },
                            { umpire1: data.umpire2 },
                            { umpire2: data.umpire1 },
                            { venue: data.venue }
                        ]
                    }
                ]
            }
        });
        if (isConflict) {
            let messages = [];
            let message = '';
            if (isConflict.umpire1 == data.umpire1 || isConflict.umpire2 == data.umpire1) {
                message = `Umpire 1 already has a match on ${data.date}`;
                messages.push(message);
            }
            if (isConflict.umpire2 == data.umpire1 || isConflict.umpire2 == data.umpire2) {
                message = `Umpire 2 already has a match on ${data.date}`;
                messages.push(message);
            }
            if (isConflict.venue == data.venue) {
                message = `Venue is already reserved for a match on ${data.date}`
                messages.push(message);
            }
            return res.status(409).json({ messages });
        }

        const updatedMatch = await MatchModel.update(data, {
            where: { id: matchId }
        })
        if (updatedMatch) {
            return res.status(200).json(`Match with ID ${matchId} has been updated`);
        }
        else {
            return res.status(400).json(`Error in Updating Match`);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);

    }
}

const updateWonStatus = async (req, res) => {
    const { matchId } = req.params;

    //Joi validation
    const matchIdValidationFail = helpingFunctionToCheckIdIsNumberandPositive('Match', teamId);
    if (matchIdValidationFail) {
        return res.status(400).json(matchIdValidationFail);
    }

    const data = req.body;
    //Only Team Won Id is passed in data
    const wonTeamIdValidationFail = helpingFunctionToCheckIdIsNumberandPositive('Won Team', teamId);
    if (wonTeamIdValidationFail) {
        return res.status(400).json(wonTeamIdValidationFail);
    }

    try {
        const isMatchExist = await MatchModel.findByPk(matchId);
        if (isMatchExist) {
            const matchDate = new Date(isMatchExist.date);
            const dateNow = new Date();
            if (matchDate > dateNow) {
                return res.status(400).json("Match is not held till now.. You wont update status");
            }
            const matchUpdate = await MatchModel.update({ won: data.teamId },
                {
                    where: { id: matchId }
                }
            );
            if (matchUpdate) {
                return res.status(200).json("Match Status Updated Successfully");
            }
            else {
                return res.status(400).json("Error in Updating Match");
            }
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

const helpingFunctionMatchSchemaValidate = (data) => {
    const { error } = matchSchema.validate(data, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message
        }));
        return errors;
    }
    else {
        return null;
    }
}

module.exports = { createMatch, searchMatchByTeamId, searchMatchByMatchId, getAllMatches, updateMatch, updateWonStatus }
