import { util } from '@aws-appsync/utils';
import { insert, select, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds';

export function request(ctx) {
    const { input: values } = ctx.args;
    values.id = util.autoUlid() // <<< set the ULID 
    const doInsert = insert({ table: 'messages', values });
    const doSelect = select({
        table: 'messages',
        columns: '*',
        where: { id: { eq: values.id } },
        limit: 1,
    });
    return createPgStatement(doInsert, doSelect);
}

export function response(ctx) {
    const { error, result } = ctx;
    if (error) {
        return util.appendError(error.message, error.type, result);
    }
    return toJsonObject(result)[1][0];
}