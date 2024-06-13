import { getNavigationsHashURL, getNavigationsURL } from "../utils/routes";

export const navigations = (isInvitedToTeaCeremony) => [
    { label: "HOME" , url: getNavigationsURL(isInvitedToTeaCeremony) },
    { label: "INFO" , url: getNavigationsHashURL(isInvitedToTeaCeremony, 'info') },
    { label: "OUR STORY" , url: getNavigationsHashURL(isInvitedToTeaCeremony, 'our_story') },
    { label: "SCHEDULE" , url: getNavigationsHashURL(isInvitedToTeaCeremony, 'schedule') },
    { label: "RSVP" , url: getNavigationsHashURL(isInvitedToTeaCeremony, 'rsvp') },
  ];
