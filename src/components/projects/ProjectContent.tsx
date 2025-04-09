import { TagsContainer } from '@/components/tags/TagsContainer.tsx';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';
import starIcon from '@icons/star.svg';

type cardType = {
    card: ElementType;
};

/**
 * Le contenu des projets
 */
export function ProjectContent({ card }: cardType) {
    return (
        <>
            <span className="card__close"></span>
            {/* <img src={card.url} alt="Preview Project" /> */}
            <h2 className="card__title">{card.title}</h2>
            {/* <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Cupiditate doloribus ex quam repellendus assumenda eligendi nam
                rerum aut sequi nulla itaque atque, et neque, ea minima magni
                fugit sunt quibusdam! Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Magni commodi fuga sed asperiores neque amet
                corporis in facilis, aliquam hic? Esse ea ipsa magni modi! Unde
                totam quo quos ullam. Lorem, ipsum dolor sit amet consectetur
                adipisicing elit. Maiores delectus et illum placeat ea, dolore
                accusamus animi, labore saepe quas architecto corrupti, quo
                nulla ullam nesciunt cum nisi voluptatem tempore. Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Placeat nisi at quo
                natus odit consectetur eius exercitationem, assumenda ducimus
                sunt dolores voluptatem molestias, cum nulla suscipit magni
                possimus! Harum, libero.
            </p> */}
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
            <TagsContainer datas={card.stack} />
        </>
    );
}
