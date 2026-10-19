import React from 'react';
import { CREATIVE_SKILLS } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  return (
    <section className="section section--about" id="about">
      <div className="about">
        <div className="about__photo">
          <img
            src="/assets/work/portrait.jpg"
            alt="Portrait of Mohammad Iftequaruddin"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0';
            }}
          />
        </div>
        <div className="about__text">
          <p className="hero__eyebrow">CHAPTER 07 &middot; PROFILE</p>
          <h2 className="section__title">About the Artist</h2>

          <p>
            I'm Mohammad Iftequaruddin, an AI &amp; Data Science engineer based in Hyderabad, India,
            with a B.Tech in Artificial Intelligence &amp; Data Science from Methodist College of
            Engineering and Technology, affiliated with Osmania University.
          </p>

          <p>
            Digital art and 3D creation are personal hobbies and creative interests of mine.
            I enjoy exploring stylized visual assets, digital imaging, visual storytelling,
            and experimenting with different 3D workflows and artistic techniques.
          </p>

          <p>
            My current creative interests include stylized 3D modeling, low-poly, voxel and
            handcrafted styles, texture and material creation, topology, UV mapping, lighting,
            shading, rendering, NPR workflows, and asset optimization. I am continuously
            exploring these areas through personal learning and experimentation.
          </p>

          <h3 className="about__subtitle">Creative Interests &amp; Tools I'm Exploring</h3>

          <ul className="chips">
            {CREATIVE_SKILLS.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
