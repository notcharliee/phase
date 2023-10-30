import mongoose from 'mongoose';
import * as discord_api_types_v10 from 'discord-api-types/v10';
import { UUID } from 'crypto';

interface DataTypes {
    identity: discord_api_types_v10.APIUser;
    guilds: discord_api_types_v10.RESTGetAPICurrentUserGuildsResult;
    session: UUID;
    token: discord_api_types_v10.RESTPostOAuth2AccessTokenResult;
    timestamp: string;
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
