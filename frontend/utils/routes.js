'use client'

export const getNavigationsURL = (isInvitedToTeaCeremony, path) => {
    let url = "/";
    
    if (path) {
      if (isInvitedToTeaCeremony) {
        url = `/${path}?tea_ceremony=yes`;
      } else {
        url = `/${path}`;
      }
    } else if (isInvitedToTeaCeremony) {
      url = "/?tea_ceremony=yes";
    }

    return url;
  };

 export const getNavigationsHashURL = (isInvitedToTeaCeremony, hash) => {
    let url = "/";
    
    if (hash) {
      if (isInvitedToTeaCeremony) {
        url = `/?tea_ceremony=yes#${hash}`;
      } else {
        url =`/#${hash}`;
      }
    }

    return url;
  };