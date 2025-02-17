import React from 'react';
import PropTypes from 'prop-types';
import themeGet from '@styled-system/theme-get';
import { withRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { getGithubRepos } from '../../lib/api';

import GithubRepositoriesFAQ from '../faqs/GithubRepositoriesFAQ';
import { Box, Flex } from '../Grid';
import { getI18nLink } from '../I18nFormatters';
import Link from '../Link';
import Loading from '../Loading';
import MessageBox from '../MessageBox';
import StyledButton from '../StyledButton';
import StyledInputField from '../StyledInputField';
import StyledLink from '../StyledLink';
import { H1, P } from '../Text';

import GithubRepositories from './GithubRepositories';

const BackButton = styled(StyledButton)`
  color: ${themeGet('colors.black.600')};
  font-size: 14px;
`;

class ConnectGithub extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    updateGithubInfo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loadingRepos: false,
      repositories: [],
      error: null,
    };
  }

  async componentDidMount() {
    this.setState({ loadingRepos: true });

    try {
      const repositories = await getGithubRepos(this.props.router.query.token);
      if (repositories.length !== 0) {
        this.setState({ repositories, loadingRepos: false });
      } else {
        this.setState({
          loadingRepos: false,
          error: "We couldn't find any repositories with at least 100 stars linked to this account",
        });
      }
    } catch (error) {
      this.setState({
        loadingRepos: false,
        error: error.toString(),
      });
    }
  }

  changeRoute = async ({ category, step }) => {
    const { hostCollectiveSlug, verb } = this.props.router.query;
    const route = [hostCollectiveSlug, verb || 'create', category, step].filter(Boolean).join('/');
    await this.props.router.push(`/${route}`);
    window.scrollTo(0, 0);
  };

  render() {
    const { repositories, loadingRepos, error } = this.state;

    return (
      <Flex flexDirection="column" m={[3, 0]} mb={4}>
        <Flex flexDirection="column" my={[2, 4]}>
          <Box textAlign="left" minHeight="32px" marginLeft={['none', '224px']}>
            <BackButton asLink onClick={() => window && window.history.back()}>
              ←&nbsp;
              <FormattedMessage id="Back" defaultMessage="Back" />
            </BackButton>
          </Box>
          <Box mb={[2, 3]}>
            <H1
              fontSize={['20px', '32px']}
              lineHeight={['24px', '36px']}
              fontWeight="bold"
              textAlign="center"
              color="black.900"
              data-cy="connect-github-header"
            >
              <FormattedMessage id="openSourceApply.GithubRepositories.title" defaultMessage="Pick a repository" />
            </H1>
          </Box>
          <Box textAlign="center" minHeight="24px">
            <P fontSize="16px" color="black.600" mb={2}>
              <FormattedMessage
                id="collective.subtitle.seeRepo"
                defaultMessage="Don't see the repository you're looking for? {helplink}."
                values={{
                  helplink: (
                    <StyledLink href="https://docs.opencollective.com/help/collectives/osc-verification" openInNewTab>
                      <FormattedMessage id="getHelp" defaultMessage="Get help" />
                    </StyledLink>
                  ),
                }}
              />
            </P>
            <P fontSize="16px" color="black.600" mb={2}>
              <FormattedMessage
                defaultMessage="Want to apply using an <AltVerificationLink>alternative verification criteria</AltVerificationLink>? <ApplyLink>Click here</ApplyLink>."
                values={{
                  ApplyLink: getI18nLink({
                    as: Link,
                    href: { pathname: `/opensource/create/form`, query: { hostTos: true } },
                  }),
                  AltVerificationLink: getI18nLink({
                    openInNewTab: true,
                    href: 'https://www.oscollective.org/#criteria',
                  }),
                }}
              />
            </P>
          </Box>
        </Flex>
        {error && (
          <Flex alignItems="center" justifyContent="center">
            <MessageBox type="error" withIcon mb={[1, 3]}>
              {error}
            </MessageBox>
          </Flex>
        )}
        {loadingRepos && (
          <Box pb={4}>
            <Loading />
          </Box>
        )}
        {repositories.length !== 0 && (
          <Flex justifyContent="center" width={1} mb={4} flexDirection={['column', 'row']}>
            <Box width={1 / 5} display={['none', null, 'block']} />
            <Box maxWidth={[400, 500]} minWidth={[300, 400]} alignSelf={['center', 'none']}>
              <StyledInputField htmlFor="collective">
                {fieldProps => (
                  <GithubRepositories
                    {...fieldProps}
                    repositories={repositories}
                    submitGithubInfo={githubInfo => {
                      this.props.updateGithubInfo(githubInfo);
                      this.changeRoute({ category: 'opensource', step: 'form' });
                    }}
                  />
                )}
              </StyledInputField>
            </Box>
            <GithubRepositoriesFAQ
              mt={4}
              ml={[0, 4]}
              display={['block', null, 'block']}
              width={[1, 1 / 5]}
              maxWidth={[250, null, 335]}
              alignSelf={['center', 'flex-start']}
              position="sticky"
              top={0}
              pt={[0, 3]}
            />
          </Flex>
        )}
      </Flex>
    );
  }
}

export default withRouter(ConnectGithub);
