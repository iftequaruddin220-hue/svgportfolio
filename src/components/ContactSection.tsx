import React from 'react';

export const ContactSection: React.FC = () => {
  return (
    <section className="section section--contact" id="contact">
      <div className="contact">
        <p className="hero__eyebrow">CHAPTER 09 &middot; CONTACT</p>
        <h2 className="section__title">Let's work together</h2>
        <p className="contact__lead">
          Interested in digital art, 3D creation, and creative technology opportunities.
        </p>
        <a className="contact__email" href="mailto:iftequaruddin220@gmail.com">
          iftequaruddin220@gmail.com
        </a>
        <p className="contact__meta">
          <a href="tel:+918519859512">+91 85198 59512</a>
          <span aria-hidden="true">&middot;</span>
          <span>Hyderabad, India</span>
        </p>
        <ul className="social">
          <li>
            <a href="https://www.artstation.com" target="_blank" rel="noopener noreferrer">
              ArtStation &#8599;
            </a>
          </li>
          <li>
            <a href="/assets/CV.pdf" target="_blank" rel="noopener noreferrer">
              CV (PDF)
            </a>
          </li>
          <li>
            <a href="mailto:iftequaruddin220@gmail.com">Email</a>
          </li>
        </ul>
      </div>
    </section>
  );
};
