import { UPDATE_FORM, CLEAR_FORM, RECEIVE_DATA } from './identifiers';

//Statuses of what Cancer.gov trials should be shown
const VIEWABLE_TRIALS = [
  'Active',
  'Approved',
  'Enrolling by Invitation',
  'In Review',
  'Temporarily Closed to Accrual',
  'Temporarily Closed to Accrual and Intervention',
];

//These are the two catch all buckets that we must add to the bottom of the list.
//ORDER will matter here.
const OTHER_MAIN_TYPES = [
  'C2916', //Carcinoma not in main type (Other Carcinoma)
  'C3262', //Neoplasm not in main type (Other Neoplasm)
  'C2991', //Disease or Disorder (Other Disease)
];

export function updateForm({ field, value }) {
  return {
    type: UPDATE_FORM,
    payload: {
      field,
      value,
    },
  };
}

export function receiveData(field, value) {
  return {
    type: RECEIVE_DATA,
    payload: {
      field,
      value,
    },
  };
}

export function getDiseasesForSimpleTypeAhead({
  name,
  size = 10,
  isDebug = false,
}) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'diseases',
      requestParams: {
        category: ['maintype', 'subtype', 'stage'],
        ancestorId: undefined,
        additionalParams: {
          name,
          size,
          sort: 'cancergov',
        },
      },
      fetchHandlers: {
        formatResponse: diseases => {
          // TODO: DEBUG
          if (isDebug) {
            diseases.forEach(
              disease =>
                (disease.fieldName += ' (' + disease.codes.join('|') + ')')
            );
          }
          return diseases;
        },
      },
    },
  };
}

export function getMainType({ size = 0, isDebug = false }) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'maintype',
      requestParams: {
        category: 'maintype',
        ancestorId: undefined,
        additionalParams: {
          size,
          current_trial_status: VIEWABLE_TRIALS,
        },
      },
      fetchHandlers: {
        formatResponse: diseases => {
          const types = [];
          const otherTypes = [];

          diseases.forEach(disease => {
            if (OTHER_MAIN_TYPES.includes(disease.codes.join('|'))) {
              otherTypes.push(disease);
            } else {
              types.push(disease);
            }
          });

          const newDiseases = types.concat(otherTypes);
          //TODO: DEBUG
          if (isDebug) {
            newDiseases.forEach(
              disease =>
                (disease.fieldName += ' (' + disease.codes.join('|') + ')')
            );
          }
          return diseases;
        },
      },
    },
  };
}

export function getSubtypes({ ancestorId, size = 0, isDebug = false }) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'subtypes',
      requestParams: {
        category: 'subtype',
        ancestorId: ancestorId,
        additionalParams: {
          size,
          current_trial_status: VIEWABLE_TRIALS,
        },
      },
      fetchHandlers: {
        formatResponse: diseases => {
          // TODO: DEBUG
          if (isDebug) {
            diseases.forEach(
              disease =>
                (disease.fieldName += ' (' + disease.codes.join('|') + ')')
            );
          }
          return diseases;
        },
      },
    },
  };
}

export function getStages({ ancestorId, size = 0, isDebug = false }) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'stages',
      requestParams: {
        category: 'stage',
        ancestorId: ancestorId,
        additionalParams: {
          size,
          current_trial_status: VIEWABLE_TRIALS,
        },
      },
      fetchHandlers: {
        formatResponse: diseases => {
          // TODO: DEBUG
          if (isDebug) {
            diseases.forEach(
              disease =>
                (disease.fieldName += ' (' + disease.codes.join('|') + ')')
            );
          }
          return diseases;
        },
      },
    },
  };
}

export function getFindings({ ancestorId, size = 0, isDebug = false }) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'findings',
      requestParams: {
        category: 'finding',
        ancestorId: ancestorId,
        additionalParams: {
          size,
          current_trial_status: VIEWABLE_TRIALS,
        },
      },
      fetchHandlers: {
        formatResponse: diseases => {
          // TODO: DEBUG
          if (isDebug) {
            diseases.forEach(
              disease =>
                (disease.fieldName += ' (' + disease.codes.join('|') + ')')
            );
          }
          return diseases;
        },
      },
    },
  };
}

export function getCountries({ size = 100 } = {}) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'countries',
      requestParams: {
        category: 'sites.org_country',
        additionalParams: {
          sort: 'term',
          current_trial_status: VIEWABLE_TRIALS,
        },
        size,
      },
      fetchHandlers: {
        formatResponse: terms => {
          return terms.map(term => term.term);
        },
      },
    },
  };
}

/**
 * Gets drugs intervention items for search field
 */
export function searchDrugs({ searchText, isDebug = false, size = 10 } = {}) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'drugs',
      requestParams: {
        category: ['Agent', 'Agent Category'],
        searchText: searchText,
        size: size,
        additionalParams: {
          current_trial_status: VIEWABLE_TRIALS,
        },
        sort: 'cancergov',
      },
      fetchHandlers: {
        formatResponse: drugs => {
          if (isDebug) {
            drugs.forEach(
              drug => (drug.name += ' (' + drug.codes.join('|') + ')')
            );
          }
          return drugs;
        },
      },
    },
  };
}

/**
 * Gets other intervention items for search field
 */
export function searchOtherInterventions({ searchText, size = 10 } = {}) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'treatments',
      requestParams: {
        category: 'Other',
        searchText: searchText,
        size: size,
        additionalParams: {
          current_trial_status: VIEWABLE_TRIALS,
        },
        sort: 'cancergov',
      },
      fetchHandlers: {
        formatResponse: (treatments, isDebug) => {
          if (isDebug) {
            treatments.forEach(
              treatment =>
                (treatment.name += ' (' + treatment.codes.join('|') + ')')
            );
          }
          return treatments;
        },
      },
    },
  };
}

export function searchHospital({ searchText, size = 10 }) {
  return {
    type: '@@api/CTS',
    payload: {
      service: 'ctsSearch',
      fieldName: 'hospital',
      requestParams: {
        category: 'sites.org_name',
        additionalParams: {
          term: searchText,
          sort: 'term',
          current_trial_status: VIEWABLE_TRIALS,
        },
        size,
      },
    },
  };
}
