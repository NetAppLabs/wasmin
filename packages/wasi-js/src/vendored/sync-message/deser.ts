import { Typeson } from "typeson";
import { builtin, date, error, regexp, typedArrays, bigint, bigintObject, arraybuffer} from 'typeson-registry';

let TYPESON_INSTANCE: Typeson;

export function getTypeson() {
    if (!TYPESON_INSTANCE) {
        const typeson = new Typeson().register([
            builtin,
            bigint,
            bigintObject,
            date,
            error,
            regexp,
            typedArrays,
            arraybuffer,
            // ...
        ]);
        TYPESON_INSTANCE = typeson;
    }
    return TYPESON_INSTANCE;
}

export function jsonStringify(obj: any) {
    const typeson = getTypeson();
    const jsonFriendly = typeson.encapsulate(obj);
    const str = JSON.stringify(jsonFriendly)
    return str;
}

export function jsonParse(jsonString: string) {
    // Parse using good old JSON.parse()
    const parsed = JSON.parse(jsonString);
    // Revive back again:
    const typeson = getTypeson();
    const revived = typeson.revive(parsed);
    return revived;
}

