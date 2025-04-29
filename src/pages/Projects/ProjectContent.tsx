import { Tags } from '@/components/HTML/tags/Tags';
import { TagsContainer } from '@/components/HTML/tags/TagsContainer';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import { useId } from 'react';

type cardType = {
    card: ElementType;
};

/**
 * Project content component.
 * @param card - Card data.
 */
export function ProjectContent({ card }: cardType) {
    Array.isArray(card.stack) ? card.stack : [card.stack];
    return (
        <>
            <span className="card__close"></span>
            <h2 className="card__title">{card.title}</h2>
            <TagsContainer>
                {card.links.map((element) => {
                    const id = useId();
                    console.log(element);
                    return (
                        <a
                            key={id}
                            href={element.link}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Tags logo={element.logo}>{element.name}</Tags>
                        </a>
                    );
                })}
            </TagsContainer>
            <p className="card__description">{card.description}</p>
            <ul className="card__content">
                {card.content.map((text, index) => (
                    <li className="content__item" key={index}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z"></path>
                        </svg>
                        <p>{text}</p>
                    </li>
                ))}
            </ul>
            <TagsContainer>
                {Object.entries(card.stack).map(([text, logoUrl]) => {
                    const id = useId();
                    return (
                        <Tags key={id} logo={logoUrl as string}>
                            {text}
                        </Tags>
                    );
                })}
            </TagsContainer>
        </>
    );
}
