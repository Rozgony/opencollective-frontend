import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import { borderRadius, fontSize, height } from 'styled-system';

import { Box, Flex } from './Grid';
import SearchIcon from './SearchIcon';
import StyledInput from './StyledInput';

const SearchInputContainer = styled(Flex)`
  border: solid 1px var(--silver-four);
  ${borderRadius};
  ${height};
  background-color: white;
`;

const SearchInput = styled(Box)`
  && {
    appearance: none;
    background-color: transparent;
    border: none;
    font-size: 1.2rem;
    letter-spacing: 0.1rem;
    font-style: italic;
    ${fontSize};
    ::placeholder {
      color: #9d9fa3;
    }
  }
`;

const SearchButton = styled(Flex)`
  && {
    appearance: none;
    background-color: transparent;
    border: none;
  }
`;

class SearchForm extends React.Component {
  handleSubmit = event => {
    event.preventDefault();
    const searchInput = event.target.elements.q;
    /*
     * Make sure we don't perform the re-fetch if search term is empty
     *
     * TODO: Remove this once, https://github.com/opencollective/opencollective/issues/5454 is done
     */
    if (searchInput.value.trim()?.length === 0) {
      return;
    }
    this.props.router.push({ pathname: '/search', query: { q: searchInput.value } });
  };

  render() {
    const {
      fontSize,
      onSubmit = this.handleSubmit,
      placeholder = 'Search...',
      width = 1,
      defaultValue,
      value,
      onChange,
      borderRadius = '20px',
      height = '46px',
    } = this.props;
    return (
      <form action="/search" method="GET" onSubmit={onSubmit}>
        <SearchInputContainer
          borderRadius={borderRadius}
          height={height}
          alignItems="center"
          justifyContent="space-between"
          p={this.props.py || 1}
        >
          <SearchButton as="button" ml={1} p={1}>
            <SearchIcon size={16} fill="#aaaaaa" />
          </SearchButton>
          <SearchInput
            as={StyledInput}
            type="search"
            name="q"
            placeholder={placeholder}
            py={1}
            pl={3}
            width={width}
            fontSize={fontSize}
            aria-label="Open Collective search input"
            defaultValue={defaultValue}
            value={value}
            onChange={onChange && (e => onChange(e.target.value))}
          />
        </SearchInputContainer>
      </form>
    );
  }
}

SearchForm.propTypes = {
  fontSize: PropTypes.string,
  defaultValue: PropTypes.string,
  py: PropTypes.string,
  value: PropTypes.string,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
  backgroundColor: PropTypes.string,
  width: PropTypes.number,
  onChange: PropTypes.func,
  borderRadius: PropTypes.string,
  height: PropTypes.string,
  router: PropTypes.object,
};

export default withRouter(SearchForm);
