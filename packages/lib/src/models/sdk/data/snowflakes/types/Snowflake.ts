/**
 * @summary A type representing a Snowflake.
 * @description A Snowflake is a 64-bit unsigned integer that is used to uniquely identify an object in Discord.
 */
type Snowflake = string & { readonly brand: unique symbol }

export type { Snowflake }
