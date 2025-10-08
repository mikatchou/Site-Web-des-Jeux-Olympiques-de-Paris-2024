import { Link } from 'react-router-dom'
import '../styles/footer.css'

export default function Footer() {
  return (
    <footer>
      <div className="footer-section">
        <h3>À propos</h3>
        <ul>
          <li className="footer-li">
            <Link to="/cgv">
              Conditions générales de vente
            </Link>
          </li>
        </ul>
      </div>

      <div className="footer-section">
        <h3>Nos partenaires</h3>
        <ul>
          <li className="footer-li">
            <Link to="/partenaires">
              Voir nos partenaires officiels
            </Link>
          </li>
        </ul>
      </div>

      <div className="footer-section">
        <h3>Assistance</h3>
        <ul>
          <li className="footer-li">
            <Link to="/contact">
              Nous contacter
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}