import { RouteComponentProps, Link } from '@reach/router';
import { Row, Col, Button, Icon } from 'antd';
import { Trans } from 'react-i18next';
import * as React from 'react';
import styled from 'styled-components';
import { useI18n } from '@bookaquest/utilities';
import { PublicRoutes } from '../../constants/routes';
import Logo from '../../shared/components/Logo';
import { RegistrationForm } from './RegistrationForm';

const HeroSection = styled.div`
  background-color: #001021;
  background-image: url('./assets/bright-squares.png');
`;

const HeroImage = styled.img``;

export function RegistrationPage(props: RouteComponentProps) {
  const { t } = useI18n();
  const signupCountainerRef = React.useRef<HTMLHeadingElement>(null);

  const handleClickStart = () => {
    if (signupCountainerRef.current) {
      signupCountainerRef.current.scrollIntoView({ behavior: 'smooth' });
      signupCountainerRef.current
        .querySelector('input')
        ?.focus({ preventScroll: true });
    }
  };

  return (
    <div className="overflow-x-hidden">
      <HeroSection className="text-white">
        <header className="px-16 py-8">
          <Row>
            <Col offset={2} span={20}>
              <div className="flex justify-between items-center">
                <Logo />
                <div className="font-medium">
                  <Link to={PublicRoutes.SignIn}>{t`Login`}</Link>
                  <a
                    className="ml-4"
                    href="mailto:vincas.stonys@bookaquest.com"
                  >{t`Contact`}</a>
                </div>
              </div>
            </Col>
          </Row>
        </header>
        <div className="p-16 flex justify-center flex-col">
          <Row gutter={64}>
            <Col offset={2} span={10}>
              <h1 className="text-white text-4xl mb-8" id="hero">
                <Trans>
                  Booking Management Software for
                  <strong> Escape Rooms</strong>
                </Trans>
              </h1>
              <Button
                onClick={handleClickStart}
                type="primary"
                size="large"
                className="flex items-center"
              >
                {t`Start for Free`}
                <Icon type="right" />
              </Button>
            </Col>
            <Col span={10}>
              <HeroImage
                src="./assets/hero.svg"
                alt={t`Woman holding sticky notes in front of calendar`}
              />
            </Col>
          </Row>
        </div>
      </HeroSection>

      <div className="bg-white py-8">
        <Row className="px-16 py-8">
          <h1
            className="text-center font-semibold text-3xl"
            id="features"
          >{t`Key Features`}</h1>
        </Row>
        <Row gutter={64} className="px-16 py-8">
          <Col offset={2} span={10}>
            <h2 className="text-2xl mb-8 font-medium">
              {t`Easy schedule management`}
            </h2>
            <p className="text-lg mb-4">{t`We make sure your schedule is clear and easy to manage.`}</p>
            <p className="text-lg">{t`Have multiple team members manage the same escape rooms.`}</p>
          </Col>
          <Col span={10}>
            <img
              className="shadow-md rounded"
              src="./assets/feature-booking-manager.png"
              alt={t`Booking manager preview`}
            />
          </Col>
        </Row>
        <Row gutter={64} className="px-16 py-8 bg-gray-100">
          <Col offset={2} span={10}>
            <img
              className="shadow-md rounded"
              src="./assets/feature-booking-app.png"
              alt={t`Reservation application preview`}
            />
          </Col>
          <Col span={10}>
            <h2 className="text-2xl mb-8 font-medium">
              {t`Smooth reservation process`}
            </h2>
            <p className="text-lg mb-4">{t`A reservation page for your escape rooms that your clients will understand.`}</p>
            <p className="text-lg">{t`We gather all the important reservation information and send confirmation emails.`}</p>
          </Col>
        </Row>
        <Row gutter={64} className="px-16 py-8">
          <Col offset={2} span={10}>
            <h2 className="text-2xl mb-8 font-medium">{t`Hassle-free setup`}</h2>
            <p className="text-lg mb-4">{t`Our process is straightforward enough that you can start accepting bookings for your escape rooms in a matter of minutes.`}</p>
            <p className="text-lg">{t`We're focused on deliver the best experience for escape room operators - intuitive interface without confusing jargon.`}</p>
          </Col>
          <Col span={10}>
            <img
              className="shadow-md rounded"
              src="./assets/feature-escape-rooms.png"
              alt={t`Escape rooms preview`}
            />
          </Col>
        </Row>
      </div>

      <div className="shadow-inner bg-gray-800 p-16">
        <Row>
          <h1
            className="text-center text-gray-100 font-semibold text-3xl mb-8"
            id="start"
          >{t`Start for Free`}</h1>
        </Row>
        <Row>
          <Col
            className="bg-white shadow-md border-gray-100 border p-8 rounded"
            offset={7}
            span={10}
          >
            <div ref={signupCountainerRef}>
              <RegistrationForm />
            </div>
          </Col>
        </Row>
      </div>
      <footer className="text-gray-100 bg-gray-800 p-4 text-center">
        © 2019 BookaQuest
      </footer>
    </div>
  );
}
