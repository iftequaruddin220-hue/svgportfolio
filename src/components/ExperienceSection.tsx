import React from 'react';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="section section--resume" id="experience">
      <div className="section__head ink-chapter ink-arrived" data-chapter="CHAPTER 08 · CAREER">
        <h2 className="section__title">Experience &amp; Education</h2>
        <p className="section__sub">Where I've built and learned</p>
      </div>

      <div className="resume">
        <div className="resume__col">
          <h3 className="resume__heading">Work Experience</h3>
          <ol className="timeline">
            <li className="timeline__item">
              <span className="timeline__year">2026 &mdash; PRESENT</span>
              <h4 className="timeline__role">Junior Software Developer &mdash; PACT Software Services Pvt. Ltd.</h4>
              <p className="timeline__desc">
                Working on ERP and business management software, contributing to software development,
                debugging, understanding business requirements, and working with existing software modules.
              </p>
            </li>
          </ol>
        </div>

        <div className="resume__col">
          <h3 className="resume__heading">Education</h3>
          <ol className="timeline">
            <li className="timeline__item">
              <span className="timeline__year">2026</span>
              <h4 className="timeline__role">B.Tech in Artificial Intelligence &amp; Data Science</h4>
              <p className="timeline__desc">
                Methodist College of Engineering and Technology &middot; Osmania University
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
