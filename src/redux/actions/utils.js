export const loading = (instance, isLoading) => async (dispatch, getState) => {
    if (instance) {
      instance.setState({
        loading: isLoading,
      });
    }
};