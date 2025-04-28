import gitIcon from '@icons/github.svg';
import linkedIn from '@icons/linkedin.svg';

/**
 * Contenu HTML de la page d'à propos
 */
export function AboutContent({ ...props }) {
    return (
        <div {...props}>
            <h1 style={{ color: 'black' }}>A propos de moi</h1>
            <h2 className="about__title" style={{ color: 'black' }}>
                Du laboratoire au code : mon parcours
            </h2>
            <p className="about__text" style={{ color: 'black' }}>
                J'ai débuté comme prothésiste dentaire, façonnant des pièces
                avec précision et minutie. <br />
                Cette rigueur reste au cœur de ma pratique aujourd'hui. <br />
                Face à la contraction du marché, j'ai pivoté vers la vente et
                réparation de matériel informatique, concrétisant ma passion de
                longue date pour la technologie.
            </p>
            <h2 className="about__title" style={{ color: 'black' }}>
                Expertise technique et humaine
            </h2>
            <p className="about__text" style={{ color: 'black' }}>
                Ma stack technique s'articule autour de React, Three.js,
                TypeScript, VanillaJS, PHP et Node.js. Ce qui enrichit vraiment
                mon approche, c'est l'expérience client acquise pendant mes
                années de vente. J'ai créé des sites WordPress professionnels
                qui m'ont permis d'observer directement l'interaction des
                utilisateurs avec mes interfaces.
                <br />
                Je conçois la 3D web non comme une fin en soi, mais comme un
                portail vers une expérience immersive. Mon objectif n'est pas de
                submerger l'utilisateur dans un univers 3D complexe, mais
                d'utiliser cette dimension pour enrichir son parcours de manière
                intuitive et mémorable.
            </p>
            <h2 className="about__title">Une approche centrée sur l'humain</h2>
            <p className="about__text">
                Ma philosophie de développement place l'expérience utilisateur
                au premier plan. <br />
                Je me pose systématiquement la question : "Comment l'utilisateur
                s'attend-il à interagir ici ?". <br />
                Cette perspective guide ma résolution de problèmes et me permet
                d'anticiper les défis techniques avec une vision claire de
                l'objectif final.
            </p>
            <h2 className="about__title">Ce qui me définit</h2>
            <p className="about__text">
                Mon parcours de vendeur m'a doté d'un esprit critique affûté et
                d'une obsession pour la précision des besoins. <br />
                Dans la vente comme dans le code, le résultat final et la
                satisfaction de l'utilisateur sont les véritables mesures du
                succès. <br />
                Je considère la 3D comme l'évolution naturelle du web ; Elle
                ajoute cette dimension "wow" qui transforme une simple visite en
                une expérience mémorable. <br />
                Mon défi quotidien est de trouver l'équilibre parfait entre
                créativité visuelle et fonctionnalité intuitive, entre
                l'émerveillement et l'efficacité.
            </p>
            <h2 className="about__title">Au-delà des écrans</h2>
            <p className="about__text">
                Les voyages, particulièrement en Asie, nourrissent ma créativité
                et élargissent mes perspectives. <br />
                Chaque culture apporte son lot d'inspirations uniques que
                j'intègre subtilement dans mes projets. <br />
                Passionné de jeux vidéo, j'y puise constamment des idées pour
                améliorer mes interfaces. <br />
                Après tout, quelle meilleure école d'expérience utilisateur
                qu'un médium où l'engagement est la clé de la réussite ?
            </p>
            <h2 className="about__title">
                Objectif : l'apprentissage perpétuel
            </h2>
            <p className="about__text">
                Mes projets sont avant tout des laboratoires d'expérimentation
                et d'apprentissage. <br />
                Je trouve une joie particulière à découvrir de nouvelles
                technologies et à les implémenter dans des situations concrètes.
                Cette curiosité insatiable me pousse à constamment repousser les
                limites de ce que je peux créer.
            </p>
            <ul className="icons">
                <li className="icon">
                    <a
                        href="https://www.github.com/AdiDevClick/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub"
                    >
                        <img src={gitIcon} alt="GitHub" />
                    </a>
                </li>
                <li className="icon">
                    <a
                        href="https://linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                    >
                        <img src={linkedIn} alt="LinkedIn" />
                    </a>
                </li>
            </ul>
        </div>
    );
}
