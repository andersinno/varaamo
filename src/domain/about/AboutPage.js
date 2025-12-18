import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import PageWrapper from '../../../app/pages/PageWrapper';
import injectT from '../../../app/i18n/injectT';
import client from '../../common/api/client';
import { translateItem } from '../../../app/state/selectors/translationSelectors';
import aboutPageSelector from './AboutPageSelector';

class UnconnectedAboutPage extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
  };

  state = {
    instructions: [],
  };

  componentDidMount() {
    this.fetchAndSetInstructions();
  }

  fetchInstructions = async () => {
    const response = await client.get('user_instructions');
    const instructions = response.data.results;
    return instructions;
  };

  fetchAndSetInstructions = async () => {
    try {
      const instructions = await this.fetchInstructions();
      const { currentLanguage } = this.props;
      const translatedInstructions = instructions.map(item => translateItem(item, currentLanguage));
      this.setState({ instructions: translatedInstructions });
    } catch (error) {
      this.setState({ instructions: [] });
    }
  };

  render() {
    const { t } = this.props;
    const { instructions } = this.state;
    return (
      <PageWrapper className="about-page" title={t('AboutPage.title')}>
        {instructions.map(instruction => (
          <div
            className="app-aboutPage__instructions"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: instruction.content }}
            key={instruction.id}
          />
        ))}
      </PageWrapper>
    );
  }
}

UnconnectedAboutPage = injectT(UnconnectedAboutPage);  // eslint-disable-line

export { UnconnectedAboutPage };
export default connect(
  aboutPageSelector,
  {},
)(UnconnectedAboutPage);
