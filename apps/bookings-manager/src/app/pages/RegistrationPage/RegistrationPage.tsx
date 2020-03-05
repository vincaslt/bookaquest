import { RouteComponentProps, Link } from '@reach/router';
import { Row, Col, Button, Icon } from 'antd';
import { Trans } from 'react-i18next';
import { parse } from 'query-string';
import * as React from 'react';
import styled from 'styled-components';
import { useI18n, classNames } from '@bookaquest/utilities';
import { PublicRoutes } from '../../constants/routes';
import Logo from '../../shared/components/Logo';
import { RegistrationForm } from './RegistrationForm';

const HeroSection = styled.div`
  background-color: #001021;
  background-image: url('./assets/bright-squares.png');
`;

const H1 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    {...props}
    className={classNames(
      props.className,
      'mb-8 font-semibold text-xl sm:text-2xl lg:text-3lx xl:text-4xl'
    )}
  >
    {props.children}
  </h1>
);

const H2 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    {...props}
    className={classNames(
      props.className,
      'mb-8 font-medium text-lg sm:text-xl lg:text-2lx xl:text-3xl'
    )}
  >
    {props.children}
  </h2>
);

export function RegistrationPage({ location, navigate }: RouteComponentProps) {
  const { t } = useI18n();
  const signupCountainerRef = React.useRef<HTMLHeadingElement>(null);

  const params = location?.search && parse(location.search);
  const verificationCode = params && params['code'];

  React.useEffect(() => {
    if (verificationCode) {
      navigate?.(PublicRoutes.SignIn, {
        state: { verificationCode },
        replace: true
      });
    }
  }, [verificationCode]);

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
            <Col md={{ offset: 2, span: 20 }}>
              <div className="flex justify-between items-center">
                <Logo className="hidden sm:block" />
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
            <Col md={{ offset: 2, span: 10 }}>
              <H1 className="text-white mt-4 tracking-wide" id="hero">
                <Trans>
                  Reservation Management Software for <u>Escape Rooms</u>
                </Trans>
              </H1>
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
            <Col span={10} className="hidden md:block">
              <img
                src="./assets/hero.svg"
                alt={t`Woman holding sticky notes in front of calendar`}
              />
            </Col>
          </Row>
        </div>
      </HeroSection>

      <div className="bg-white">
        <Row className="px-16 pt-16 text-center">
          <H1 id="features">{t`Key Features`}</H1>
        </Row>
        <Row gutter={64} className="px-16 pt-8">
          <Col md={{ offset: 2, span: 10 }} className="mb-8">
            <H2>{t`Easy schedule management`}</H2>
            <p className="text-lg mb-4">{t`We make sure your schedule is clear and easy to manage.`}</p>
            <p className="text-lg">{t`Have multiple team members manage the same escape rooms.`}</p>
          </Col>
          <Col md={{ span: 10 }} className="mb-8">
            <img
              className="shadow-md rounded"
              src="./assets/feature-booking-manager.png"
              alt={t`Reservation manager preview`}
            />
          </Col>
        </Row>
        <Row gutter={64} className="px-16 pt-8 bg-gray-100" type="flex">
          <Col md={{ span: 10, order: 2 }} className="mb-8">
            <h2 className="text-2xl mb-8 font-medium">
              {t`Smooth reservation process`}
            </h2>
            <p className="text-lg mb-4">{t`A reservation page for your escape rooms that your clients will understand.`}</p>
            <p className="text-lg">{t`We gather all the important reservation information and send confirmation emails.`}</p>
          </Col>
          <Col md={{ offset: 2, span: 10, order: 1 }} className="mb-8">
            <img
              className="shadow-md rounded"
              src="./assets/feature-booking-app.png"
              alt={t`Reservation application preview`}
            />
          </Col>
        </Row>
        <Row gutter={64} className="px-16 pt-8">
          <Col md={{ offset: 2, span: 10 }} className="mb-8">
            <h2 className="text-2xl mb-8 font-medium">{t`Hassle-free setup`}</h2>
            <p className="text-lg mb-4">{t`Our process is straightforward enough that you can start accepting reservations for your escape rooms in a matter of minutes.`}</p>
            <p className="text-lg">{t`We're focused on deliver the best experience for escape room operators - intuitive interface without confusing jargon.`}</p>
          </Col>
          <Col md={{ span: 10 }} className="mb-8">
            <img
              className="shadow-md rounded"
              src="./assets/feature-escape-rooms.png"
              alt={t`Escape rooms preview`}
            />
          </Col>
        </Row>
      </div>

      <div className="shadow-inner bg-gray-800 py-8 md:py-16 sm:px-8 md:px-16">
        <Row>
          <H1
            className="text-center text-gray-100"
            id="start"
          >{t`Start for Free`}</H1>
        </Row>
        <Row>
          <Col
            className="bg-white shadow-md border-gray-100 border p-4 sm:p-8 rounded"
            md={{ offset: 2, span: 20 }}
            lg={{ offset: 5, span: 14 }}
            xl={{ offset: 6, span: 12 }}
            xxl={{ offset: 7, span: 10 }}
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
