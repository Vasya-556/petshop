import React from 'react'

function AboutUs() {
  return (
    <div className='team-container'>
      <div className="member">
          <div className="name">Kobryn Vasyl</div>
          <div className="role">Backend Developer & Team Leader</div>
          <div className="github"><a href="https://github.com/Vasya-556" target="_blank">GitHub Profile</a></div>
      </div>

      <hr />

      <div className="member">
          <div className="name">Adriana Buranovska</div>
          <div className="role">Frontend Developer</div>
          <div className="github"><a href="https://github.com/Adriana1B" target="_blank">GitHub Profile</a></div>
      </div>
    </div>
  )
}

export default AboutUs