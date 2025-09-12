import React from "react";
export type ActionColumn<TModel> = {
    type: "actions";
    archive?: string | boolean | false | ((model: TModel) => string | boolean);
    edit?: string | boolean | false | ((model: TModel) => string | boolean);
    view?: string | boolean | false | ((model: TModel) => string | boolean);
    idField: keyof TModel;
    extraButtons?: [(model: TModel) => React.ReactNode];
    className?: string;
};
export type SimpleColumn<TModel> = {
    name: keyof TModel;
    title: string;
    truncate?: number;
    type?: "code";
    pin?: true;
    className?: string;
};
export type DateColumn<TModel> = {
    name: keyof TModel;
    type: "date";
    format?: string;
    title: string;
    pin?: true;
    className?: string;
};
export type FunctionColumn<TModel> = {
    name?: string;
    body: (data: TModel) => string | number | React.ReactNode;
    title: string;
    pin?: true;
    className?: string;
};
export type ColumnType<TModel> = SimpleColumn<TModel> | FunctionColumn<TModel> | ActionColumn<TModel> | DateColumn<TModel>;
export declare function isActionColumn<TModel>(column: ColumnType<TModel>): column is ActionColumn<TModel>;
export declare function isFunctionColumn<TModel>(column: ColumnType<TModel>): column is FunctionColumn<TModel>;
//# sourceMappingURL=columnTypes.d.ts.map