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
              <h4 className="timeline__role">Techno-Functional Consultant &mdash; PACT Software Services Pvt. Ltd.</h4>
              <p className="timeline__desc">
                Translating client requirements into functional specifications and software workflows for ERP modules, analyzing business processes, coordinating between clients and development teams, and executing module testing, data validation, and UAT.
              </p>
            </li>
            <li className="timeline__item">
              <span className="timeline__year">2026</span>
              <h4 className="timeline__role">AI Data Annotation &amp; Evaluation Specialist &mdash; Innodata</h4>
              <p className="timeline__desc">
                Performed AI data annotation and model evaluation in production workflows using project-specific guidelines, structured quality criteria, and error detection.
              </p>
            </li>
          </ol>
        </div>

        <div className="resume__col">
          <h3 className="resume__heading">Education &amp; Credentials</h3>
          <ol className="timeline">
            <li className="timeline__item">
              <span className="timeline__year">SEP 2022 &mdash; SEP 2026</span>
              <h4 className="timeline__role">Bachelor of Engineering (B.E.), Artificial Intelligence &amp; Data Science</h4>
              <p className="timeline__desc">
                Methodist College of Engineering &amp; Technology, Hyderabad
              </p>
            </li>
            <li className="timeline__item">
              <span className="timeline__year">CREDENTIALS</span>
              <h4 className="timeline__role">Industry Certifications</h4>
              <p className="timeline__desc">
                Google Data Analytics &middot; Microsoft Power BI Data Analyst &middot; IBM SkillsBuild AI &amp; Data Science &middot; Google Cloud ML &amp; AI
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
