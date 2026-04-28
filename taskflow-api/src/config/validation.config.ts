import Joi from "joi";

export const validationConfig = Joi.object({
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().default(3306),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_SYNCHRONIZE: Joi.boolean().default(false),
    POSTGRES_LOGGING: Joi.boolean().default(false),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ACCESS_TTL: Joi.string().default('15m'),
});
