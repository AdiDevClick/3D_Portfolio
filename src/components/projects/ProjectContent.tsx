import { TagsContainer } from '@/components/tags/TagsContainer.tsx';
import { ElementType } from '@/hooks/reducers/carouselTypes.ts';

type cardType = {
    card: ElementType;
};

/**
 * Le contenu des projets
 */
export function ProjectContent({ card }: cardType) {
    return (
        <>
            {/* <img src={card.url} alt="Preview Project" /> */}
            <h2>{card.title}</h2>
            <p>
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
            </p>
            {/* <p>{card.description}</p> */}
            <TagsContainer datas={card.stack} />
            <button>Retour</button>
        </>
    );
}
