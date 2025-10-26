import { PiShootingStarBold } from "react-icons/pi";

export default function Registered () {
    return <>
        <div className="registered-container">
        <h3 id="registered-title">Votre compte viens d'être crée !    <PiShootingStarBold /></h3>
        <p id="registered-p">Un mail de confirmation vient de vous être envoyé, veuillez cliquer sur lien afin d'activer votre compte et commencer à faire des achats.</p>
    </div>
    <style>{`
        .registered-container {
            display: flex;
            flex-direction: column;
            background-color: var(--color-form-background);
            border-radius: 80px;
            box-shadow: 0 0 4px var(--color-primary);
            padding: 15vh 15vh;
            height: fit-content;
            width: 90%;
            max-width: 850px;
            gap : 80px;
        }
        #registered-title {
            font-size: 3.5lvh;
            text-align: center;
        }
        #registered-p {
            color: var(--color-tertiary);
            font-weight: lighter;
        }
        @media (max-width: 800px) {
            .registered-container {
                padding: 50px;
                gap: 50px;
                border-radius: 50px;
                width: 90%;
            }
            #registered-title {
                font-size: 3lvh;
                text-align: center;
            }
        }
    `}</style>
</>
}