import { IconWithText } from '@/components/3DComponents/3DIcons/IconWithText.tsx';
import { JSX } from 'react';

export function IconsContainer({
    icons,
    scalar,
    ...props
}: {
    icons: Array<{ name: string; url: string }>;
    scalar: number;
} & JSX.IntrinsicElements['group']) {
    return (
        <group>
            {icons.map((icon, index) => {
                return (
                    <IconWithText
                        key={index}
                        scalar={scalar}
                        position-y={-0.5 * index * scalar}
                        position-x={0.1 * index * scalar}
                        model={resolvePath(`@models/${icon.url}`)}
                        text={icon.name}
                        {...props}
                    />
                );
            })}
        </group>
    );
}
// <IconWithText key={index} model={icon} text={icon} />
function resolvePath(aliasPath: string) {
    const aliasMap = {
        '@models': '/src/3DModels',
    };
    const [alias, ...rest] = aliasPath.split('/');
    if (aliasMap[alias]) {
        return new URL(`${aliasMap[alias]}/${rest.join('/')}`, import.meta.url)
            .href;
    }
    throw new Error(`Alias "${alias}" non reconnu`);
}
