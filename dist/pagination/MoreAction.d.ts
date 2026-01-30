import React from "react";
export type MoreActionType = {
    label: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    onClick?: () => Promise<string | void>;
    href?: string;
    hidden?: boolean;
    enableWhenSpaceIsAvailable?: boolean;
    disableNProgress?: boolean;
    disabled?: boolean;
    testId?: string;
};
export declare const MoreActions: ({ itemClassName, rootClassName, actions, }: {
    itemClassName?: string;
    rootClassName?: string;
    actions: MoreActionType[];
}) => import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=MoreAction.d.ts.map