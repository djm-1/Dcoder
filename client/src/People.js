import React from 'react'
import Avatar from 'react-avatar'
export default function People({username}) {
  return (
    <div>
      <Avatar name={username} size={50} round='14px' style={{margin:'4px'}}/>
      <span>
        {username}
      </span>
    </div>
  )
}
