import { Database } from "../classes/mod.ts";
import {
    isArray,
    isBoolean,
    isInfinity,
    isNaN,
    isNull,
    isNumber,
    isPlainObject,
    isString,
    isUndefined,
} from "@online/is";
import { numberSerializer } from "./number.serializer.ts";
import { stringSerializer } from "./string.serializer.ts";
import { booleanSerializer } from "./boolean.serializer.ts";
import { undefinedSerializer } from "./undefined.serializer.ts";
import { nullSerializer } from "./null.serializer.ts";
import { infinitySerializer } from "./infinity.serializer.ts";
import { nanSerializer } from "./nan.serializer.ts";
import { databaseSerializer } from "./database.serializer.ts";
import { SerializeOptions } from "../interfaces/mod.ts";
import { referenceSerializer } from "./reference.serializer.ts";
import { stringReferenceSerializer } from "./string-reference.serializer.ts";

export function unknownSerializer(
    value: unknown,
    options: SerializeOptions,
): Uint8Array {
    switch (true) {
        case isNumber(value):
            return numberSerializer(value);
        case isString(value):
            if (options.stringDatabase.has(value)) {
                return stringReferenceSerializer(value, options);
            }

            return stringSerializer(value, options);
        case isBoolean(value):
            return booleanSerializer(value);
        case isArray(value) || isPlainObject(value):
            // Try to resolve the reference, otherwise serialize the object
            return referenceSerializer(value, options);
        case isUndefined(value):
            return undefinedSerializer();
        case isNull(value):
            return nullSerializer();
        case isInfinity(value):
            return infinitySerializer(value < 0);
        case isNaN(value):
            return nanSerializer();
        // String databases only!!
        case value instanceof Database:
            return databaseSerializer(value);
        default:
            throw new Error("Non serializable value found", { cause: value });
    }
}