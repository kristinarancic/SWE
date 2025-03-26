import Button from "@mui/material/Button";
import { isBuyer } from "../../../../components/helpers/roleConditionals";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import CallIcon from "@mui/icons-material/Call";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import "./Contact.css";

import { IContact } from "../../../helpers/Interfaces";
import { toggleEditShopDialog } from "../../../../services/Dialog/dialogSlice";
import { useDispatch } from "react-redux";
import EditShopInfo from "./EditShopInfo";

interface IWorkingHours {
  workingDays: { start: string; finish: string };
  saturday: { start: string; finish: string };
  sunday: { start: string; finish: string };
}

interface Props {
  contact: IContact;
  role: string;
  isCurrent: boolean;
  workingHours: IWorkingHours;
}

const Contact: React.FC<Props> = ({
  contact,
  role,
  isCurrent,
  workingHours,
}) => {
  const dispatch = useDispatch();
  const handleInstagramClick = () => {
    window.open(contact.instagram, "_blank");
  };

  const handleFacebookClick = () => {
    window.open(contact.facebook, "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  return (
    <>
      <EditShopInfo />
      <section id="Kontakt" className="kontakt">
        <div className="container-contact">
          <div className="informacions-and-button">
            <div className="rounded-div">
              <h2 className="contact-shop-h2">Kontakt</h2>
              <hr className="hr-contact" />
              <div className="informations-shop">
                <div className="text-and-icon">
                  <CallIcon />
                  <h3 className="basic-infos">{contact.phone}</h3>
                </div>
                <div className="text-and-icon">
                  <EmailOutlinedIcon onClick={handleEmailClick} />
                  <h3 className="basic-infos">{contact.email}</h3>
                </div>
                <div className="text-and-icon">
                  <FmdGoodOutlinedIcon />
                  <h3 className="basic-infos">
                    {contact.residence?.address}, {contact.residence?.zip},{" "}
                    {contact.residence?.city}
                  </h3>
                </div>
                <div className="contact-us-div">
                  {isBuyer(role) && (
                    <Button className="contact-us">Pošalji nam poruku</Button>
                  )}
                </div>
              </div>
            </div>
            {isCurrent && (
              <>
                <Button
                  className="button-changeInf"
                  onClick={() => {
                    dispatch(toggleEditShopDialog());
                  }}
                >
                  Izmeni informacije
                </Button>
              </>
            )}
          </div>
          <div className="workingHours-and-socialMedias">
            <div>
              <h2 className="workingHours">Radno vreme:</h2>
              {workingHours.workingDays.start &&
                workingHours.workingDays.finish && (
                  <h3 className="wh-h3">
                    Radnim danima: {workingHours.workingDays.start} -{" "}
                    {workingHours.workingDays.finish}
                  </h3>
                )}
              {workingHours.saturday.start && workingHours.saturday.finish && (
                <h3 className="wh-h3">
                  Subotom: {workingHours.saturday.start} -{" "}
                  {workingHours.saturday.finish}
                </h3>
              )}
              {workingHours.sunday.start && workingHours.sunday.finish && (
                <h3 className="wh-h3">
                  Nedeljom: {workingHours.sunday.start} -{" "}
                  {workingHours.sunday.finish}
                </h3>
              )}
            </div>
            <div className="socialMedias">
              <Button onClick={handleInstagramClick}>
                <InstagramIcon className="icon" />
              </Button>
              <Button onClick={handleFacebookClick}>
                <FacebookIcon className="icon" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
