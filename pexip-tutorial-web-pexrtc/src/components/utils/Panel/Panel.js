import './Panel.css';
import React from 'react';


function Panel (props) {
  return <div className='Panel'>{props.children}</div>
}

export default Panel;
