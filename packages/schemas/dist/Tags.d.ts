import mongoose from 'mongoose';

declare const TagSchema: mongoose.Model<Tag, {}, {}, {}, mongoose.Document<unknown, {}, Tag> & Tag & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Tag = {
    guild: string;
    tags: {
        name: string;
        value: string;
    }[];
};

export { Tag, TagSchema };
