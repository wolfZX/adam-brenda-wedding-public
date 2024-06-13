'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

import { submitRSVP, validateForm } from "../actions";
import { getFieldElementValue } from '../../frontend/utils/dom';
import Modal from '../../frontend/components/modal';
import Button from '../../frontend/components/button';
import { getNavigationsHashURL, getNavigationsURL } from '../../frontend/utils/routes';
import Input from '../../frontend/components/input';
import LicenseFooter from '../../frontend/components/license-footer';

export default function Page() {
  const searchParams = useSearchParams();
  const guestSide = searchParams.get('side');
  const teaCeremony = searchParams.get('tea_ceremony');
  const isInvitedToTeaCeremony = teaCeremony && teaCeremony === "yes";
  const router = useRouter();
  
  useEffect(() => {
    const side = searchParams.get('side');
    if (!(side && ['groom', 'bride'].includes(side))) {
      let url = getNavigationsHashURL(isInvitedToTeaCeremony, 'rsvp');
      router.push(url);
    } else if (!isInvitedToTeaCeremony) {
      setUser((prev) => ({
        ...prev,
        attending_reception: 'Yes',
      }));
    }
  }, [router, searchParams, isInvitedToTeaCeremony]);

  const [fieldErrors, setFieldErrors] = useState({});
  const [user, setUser] = useState({
    guest_side: guestSide,
    first_name: '',
    last_name: '',
    mobile_number: '',
    attending_reception: '',
    number_of_accompany_guest_reception: '',
    attending_tea_ceremony: '',
    number_of_accompany_guest_tea_ceremony: '',
  });
  const [modalState, setModalState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);

  const disableSubmit = !(user.attending_reception || user.attending_tea_ceremony);

  const handleBack = () => {
    let url = getNavigationsURL(isInvitedToTeaCeremony);
    return router.push(url);
  };

  const handleClickSubmit = async (e) => {
    if (!disableSubmit) {
      setIsLoading(true);
      let formData = {
        guest_side: guestSide,
        first_name: getFieldElementValue('first_name'),
        last_name: getFieldElementValue('last_name'),
        mobile_number: getFieldElementValue('mobile_number'),
        attending_reception: user.attending_reception,
        number_of_accompany_guest_reception: getFieldElementValue('number_of_accompany_guest_reception'),
      }
  
      if (isInvitedToTeaCeremony) {
        formData = {
          ...formData,
          attending_tea_ceremony: user.attending_tea_ceremony,
          number_of_accompany_guest_tea_ceremony: getFieldElementValue('number_of_accompany_guest_tea_ceremony'),
        }
      }
  
      const { errors } = await validateForm(formData, isInvitedToTeaCeremony);
      if (errors
        && Object.keys(errors).length === 0
        && errors.constructor === Object) {
        setFieldErrors({});
        setUser(formData);
        setModalState(true);
      } else {
        setFieldErrors(errors);
      }
      setIsLoading(false);
    }
  };

  const convertToNumber = (str) => {
    if (str) {
      return parseInt(str, 10);
    }
    return 0;
  };

  const handleSubmit = async () => {
    if (!disableSubmit) {
      setIsLoading(true);
      let formData = {
        guest_side: guestSide,
        first_name: getFieldElementValue('first_name'),
        last_name: getFieldElementValue('last_name'),
        mobile_number: getFieldElementValue('mobile_number'),
        attending_reception: user.attending_reception,
        number_of_accompany_guest_reception: convertToNumber(getFieldElementValue('number_of_accompany_guest_reception')),
      }
  
      if (isInvitedToTeaCeremony) {
        formData = {
          ...formData,
          attending_tea_ceremony: user.attending_tea_ceremony,
          number_of_accompany_guest_tea_ceremony: convertToNumber(getFieldElementValue('number_of_accompany_guest_tea_ceremony')),
        }
      }
  
      const thankYouURL = getNavigationsURL(isInvitedToTeaCeremony, "thankyou");
  
      try {
        submitRSVP(formData, thankYouURL, isInvitedToTeaCeremony);
      } catch (error) {
        setIsLoading(false);
        setHasSubmitError(true);
      }
    }
  };

  const handleCloseModal = () => {
    if (hasSubmitError) {
      setHasSubmitError(false);
    }
    setModalState(false);
  };

  const getErrorText = (arr) => {
    if (arr && Array.isArray(arr) && arr.length > 0) {
      return arr[0];
    }
    return '';
  };

  const getTotalGuest = (totalAccompaniyingGuest) => {
    if (totalAccompaniyingGuest) {
      const formatted = parseInt(totalAccompaniyingGuest, 10);
      if (formatted && typeof formatted === 'number') {
        return formatted + 1;
      } else if (formatted !== 0) {
        return "Error";
      }
    }
    return "1";
  };

  const renderConfirmationModal = () => {
    const isAttendingReception = user && user.attending_reception && user.attending_reception === "Yes";
    let fields = [
      { label: 'Full name', name: "full_name", value: `${user.first_name} ${user.last_name}`},
      { label: 'Mobile number', name: "mobile_number", value: user.mobile_number },
      { label: 'Attending Wedding Reception', name: 'attending_reception', value: user.attending_reception || "No" },
      { label: 'Total attendees for reception', name: "total_guest_reception", value: isAttendingReception ? getTotalGuest(user.number_of_accompany_guest_reception || "0") : "0" },
    ];

    if (isInvitedToTeaCeremony) {
      fields.push({
        label: 'Attending Tea Ceremony',
        name: "attending_tea_ceremony",
        value: user.attending_tea_ceremony || "No",
      });

      const isAttendingTeaCeremony = user && user.attending_tea_ceremony && user.attending_tea_ceremony === "Yes";
      if (isAttendingTeaCeremony) {
        fields.push({
          label: 'Total attendees for tea ceremony',
          name: "total_guest_tea_ceremony",
          value: getTotalGuest(user.number_of_accompany_guest_tea_ceremony || "0"),
        });
      }
    }

    return (
      <Modal
        loading={isLoading}
        open={modalState}
        title="Pending Party Request"
        content={
          hasSubmitError ? (
            <p className="my-4">
              Attention, recruit! Our servers have encountered a malfunction, delaying your RSVP transmission. Recalibrate your entry and resubmit to join the &quot;Party&quot;!
            </p>
          ) : (
            <>
              <p className="my-4">
                Before we confirm your invite into the &quot;Party&quot;, please verify your RSVP information below.
                By confirming, you&apos;ll then be granted access to the &quot;raid&quot; filled with unforgettable memories.
              </p>
              {
                fields.map((field) => (
                  <p key={field.name}>
                    <b>{field.label}: </b>
                    {field.value}
                  </p>
                ))
              }
            </>
          )
        }
        onConfirm={() => hasSubmitError ? handleCloseModal() : handleSubmit()}
        onClose={handleCloseModal}
      />
    );
  };

  //  render separately if guest is invited to both reception and tea ceremony
  const renderReceptionDetails = () => {
    if (isInvitedToTeaCeremony) {
      return (
        <div className="mt-10 mb-10">
          <h3 className="header text-center">Wedding Reception</h3>
          <div className="mt-4 flex gap-5 items-start flex-col md:flex-row md:items-center">
            <div className="w-full text-center md:text-left">
              <input
                type="checkbox"
                id="attending_reception"
                name="attending_reception"
                disabled={isLoading}
                onClick={(e) => {
                  setUser((prev) => ({
                    ...prev,
                    [e.target.name]: prev[e.target.name] === "Yes" ? "" : "Yes",
                    number_of_accompany_guest_reception: "0",
                  }))
                }}
              />
              <label className="ml-2 inline-block mb-1">Yes, I am attending</label>
            </div>

            <Input
              className="w-full"
              label="Number of guest accompanying you"
              type="number"
              min="0"
              id="number_of_accompany_guest_reception"
              name="number_of_accompany_guest_reception"
              disabled={!(user && user.attending_reception && user.attending_reception.trim() === "Yes") || isLoading}
              error={getErrorText(fieldErrors.number_of_accompany_guest_reception)}
              onChange={(e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              value={user.number_of_accompany_guest_reception}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTeaCeremonyDetails = () => {
    if (isInvitedToTeaCeremony) {
      return (
        <div className="mt-10 mb-10">
          <h3 className="header text-center">Tea Ceremony</h3>
          <div className="mt-4 flex gap-5 items-start flex-col md:flex-row md:items-center">
            <div className="w-full text-center md:text-left">
              <input
                type="checkbox"
                id="attending_tea_ceremony"
                name="attending_tea_ceremony"
                disabled={isLoading}
                onClick={(e) => {
                  setUser((prev) => ({
                    ...prev,
                    [e.target.name]: prev[e.target.name] === "Yes" ? "" : "Yes",
                    number_of_accompany_guest_tea_ceremony: "0",
                  }))
                }}
              />
              <label className="ml-2 inline-block mb-1">Yes, I am attending</label>
            </div>

            <Input
              className="w-full"
              label="Number of guest accompanying you"
              type="number"
              min="0"
              id="number_of_accompany_guest_tea_ceremony"
              name="number_of_accompany_guest_tea_ceremony"
              disabled={!(user && user.attending_tea_ceremony && user.attending_tea_ceremony.trim() === "Yes") || isLoading}
              error={getErrorText(fieldErrors.number_of_accompany_guest_tea_ceremony)}
              onChange={(e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              value={user.number_of_accompany_guest_tea_ceremony}
            />
          </div>
        </div>
      );
    }

    return null;
  };

    return (
      <div className={`relative bg-blue-dark text-white flex flex-col items-center min-w-[320px] px-4 pt-4 ${isInvitedToTeaCeremony ? 'pb-20 h-full' : 'h-screen'}`}>
        <Image
          className="absolute mt-4 ml-4 top-0 left-0 w-auto h-auto max-w-[150px] max-h-[150px] min-w-[60px] min-h-[60px] md:min-w-[88px] md:min-h-[88px]"
          src="/rsvp-border-top-left.png"
          alt="Logo"
          sizes="100vw"
          width={180}
          height={180}
        />
        <Image
          className="absolute mt-4 mr-4 top-0 right-0 w-auto h-auto max-w-[150px] max-h-[150px] min-w-[60px] min-h-[60px] md:min-w-[88px] md:min-h-[88px]"
          src="/rsvp-border-top-right.png"
          alt="Logo"
          sizes="100vw"
          width={180}
          height={180}
        />
        <Image
          className="absolute mb-4 ml-4 bottom-0 left-0 w-auto h-auto max-w-[150px] max-h-[150px] min-w-[60px] min-h-[60px] md:min-w-[88px] md:min-h-[88px]"
          src="/rsvp-border-bottom-left.png"
          alt="Logo"
          sizes="100vw"
          width={180}
          height={180}
        />
        <Image
          className="absolute mb-4 mr-4 bottom-0 right-0 w-auto h-auto max-w-[150px] max-h-[150px] min-w-[60px] min-h-[60px] md:min-w-[88px] md:min-h-[88px]"
          src="/rsvp-border-bottom-right.png"
          alt="Logo"
          sizes="100vw"
          width={180}
          height={180}
        />
        <div className="text-center flex flex-col items-center">
          <Image
            priority
            className="mt-8 mb-4 w-full h-auto max-w-[200px] md:max-w-[350px]"
            src="/full-logo-white.png"
            alt="Logo"
            sizes="100vw"
            width={300}
            height={244}
          />
          <h1 className="header w-full">RSVP</h1>
        </div>

        <form id="rsvpForm" className="mt-5 w-full max-w-screen-md">
          <div>
            <label className="inline-block mb-1 required-text">Full Name</label>
            <div className="flex items-baseline justify-between gap-5">
              <Input
                className="w-full"
                type="text"
                required
                id="first_name"
                name="first_name"
                placeholder="First name"
                disabled={isLoading}
                error={getErrorText(fieldErrors.first_name)}
              />
              <Input
                className="w-full"
                type="text"
                required
                id="last_name"
                name="last_name"
                placeholder="Last name"
                disabled={isLoading}
                error={getErrorText(fieldErrors.last_name)}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-5 items-start flex-col md:flex-row md:items-baseline md:justify-between">
            <Input
              className={`w-full ${isInvitedToTeaCeremony ? 'md:w-[48%]' : ''}`}
              type="number"
              required
              id="mobile_number"
              name="mobile_number"
              label="Mobile number"
              placeholder="Example: 60123456789"
              disabled={isLoading}
              error={getErrorText(fieldErrors.mobile_number)}
            />
            {
              !isInvitedToTeaCeremony && (
                <Input
                  className="w-full"
                  label="Number of guest accompanying you"
                  type="number"
                  min="0"
                  id="number_of_accompany_guest_reception"
                  name="number_of_accompany_guest_reception"
                  disabled={isLoading}
                  error={getErrorText(fieldErrors.number_of_accompany_guest_reception)}
                />
              )
            }
          </div>

          { renderReceptionDetails() }
          { renderTeaCeremonyDetails() }

          <div className="mt-8 flex items-center justify-center gap-5">
            <Button onClick={handleClickSubmit} loading={isLoading} disabled={disableSubmit}>
              Submit
            </Button>
            <Button type="secondary" onClick={handleBack} loading={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
        <LicenseFooter />

        { renderConfirmationModal() }
      </div>
    )
  }