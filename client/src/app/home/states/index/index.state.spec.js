import assert from 'assert';
import statesModule from '../states.module';

describe(`module ${statesModule}`, () => {

  beforeEach(() => {
    angular.mock.module(statesModule);
  });

  describe('state `home`', () => {

    let state;

    beforeEach(inject(($state) => {
      state = $state.get('home');
    }));

    it('has valid url', inject(($state) => {
      assert.equal($state.href(state), '#!/');
    }));

  });

});
