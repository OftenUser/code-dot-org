import React from 'react';
import {mount} from 'enzyme';
import {expect} from '../../../../util/reconfiguredChai';
import InternationalOptIn from '@cdo/apps/code-studio/pd/international_opt_in/InternationalOptIn';

describe('InternationalOptInTest', () => {
  const defaultProps = {
    options: {
      gender: ['gender'],
      schoolCountry: ['schoolCountry', 'colombia'],
      ages: ['age'],
      subjects: ['subject'],
      resources: ['resource'],
      robotics: ['robotics'],
      workshopCourse: ['workshopCourse'],
      emailOptIn: ['emailOptIn'],
      legalOptIn: ['legalOptIn'],
      workshopOrganizer: ['workshopOrganizer'],
      workshopFacilitator: ['workshopFacilitator'],
      colombianSchoolData: {
        department: {
          municipality: {
            city: ['branch']
          }
        }
      }
    },
    accountEmail: 'test@code.org',
    apiEndpoint: '/api/v1/pd/international_opt_ins',
    labels: {
      firstName: 'First Name',
      firstNamePreferred: 'Preferred First Name',
      lastName: 'Last Name',
      email: 'Email',
      emailAlternate: 'Alternate Email',
      gender: 'Gender Identity',
      school: 'School',
      schoolCity: 'School City',
      schoolCountry: 'School Country',
      schoolDepartmentRegion: 'School Department/Region',
      schoolName: 'School Name',
      ages: 'Which age(s) do you teach this year?',
      subjects: 'Which subject(s) do you teach this year?',
      resources: 'Which of the following CS education resources do you use?',
      robotics: 'Which of the following robotics resources do you use?',
      workshopOrganizer: 'Workshop Organizer',
      workshopFacilitator: 'Workshop Facilitator',
      workshopCourse: 'Workshop Course',
      emailOptIn:
        'Can we email you about Code.org’s international program, updates to our courses, or other computer science news?',
      legalOptIn:
        'By submitting this form, you are agreeing to allow Code.org to share information on how you use Code.org and the Professional Learning resources with the Code.org International Partner(s) in your country, school district, and facilitators. We will share your contact information, which courses/units you are using and aggregate data about your classes with these partners. This includes the number of students in your classes, the demographic breakdown of your classroom, and the name of your school ...',
      colombianSchoolCity: 'School City',
      colombianChileanSchoolDepartment: 'School Department',
      colombianSchoolMunicipality: 'School Municipality',
      colombianChileanSchoolName: 'School Name',
      chileanSchoolCommune: 'School Commune',
      chileanSchoolId: 'School ID',
      uzbekistanSchoolDistrict: 'School City/District'
    }
  };

  describe('Colombian school interface', () => {
    it('requires you to select a country before enabling school name and city inputs', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);
      const inputIds = ['schoolName', 'schoolCity'];

      inputIds.forEach(id => {
        const node = wrapper.find('input#' + id);
        expect(node.prop('disabled')).to.be.true;
      });

      wrapper.setState({data: {schoolCountry: 'selected country'}});

      inputIds.forEach(id => {
        const node = wrapper.find('input#' + id);
        expect(node.prop('disabled')).to.be.false;
      });
    });

    it('displays school name and city as selects rather than inputs when Colombia is selected', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(1);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolCity')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolName')).to.have.lengthOf(0);

      wrapper.setState({
        data: {schoolCountry: 'someplace other than colombia'}
      });

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(1);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolCity')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolName')).to.have.lengthOf(0);

      wrapper.setState({data: {schoolCountry: 'colombia'}});

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(0);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolCity')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolName')).to.have.lengthOf(1);
    });

    it('displays extra inputs when Colombia is selected', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolMunicipality')).to.have.lengthOf(0);

      wrapper.setState({
        data: {schoolCountry: 'someplace other than colombia'}
      });

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolMunicipality')).to.have.lengthOf(0);

      wrapper.setState({data: {schoolCountry: 'colombia'}});

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolMunicipality')).to.have.lengthOf(1);
    });

    it('requires each Colombian school data field be selected in order', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);
      wrapper.setState({data: {schoolCountry: 'colombia'}});

      expect(wrapper.find('select#schoolMunicipality').prop('disabled')).to.be
        .true;
      expect(wrapper.find('select#schoolCity').prop('disabled')).to.be.true;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolDepartment: 'department', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolMunicipality').prop('disabled')).to.be
        .false;
      expect(wrapper.find('select#schoolCity').prop('disabled')).to.be.true;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolMunicipality: 'municipality', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolMunicipality').prop('disabled')).to.be
        .false;
      expect(wrapper.find('select#schoolCity').prop('disabled')).to.be.false;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolCity: 'city', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolMunicipality').prop('disabled')).to.be
        .false;
      expect(wrapper.find('select#schoolCity').prop('disabled')).to.be.false;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.false;
    });

    it('populates the Colombian school data fields based on earlier selections', () => {
      const expandedColombianSchoolData = {
        'department 1': {
          'municipality 1-1': {
            'city 1-1-1': ['branch 1-1-1-1', 'branch 1-1-1-2'],
            'city 1-1-2': ['branch 1-1-2-1', 'branch 1-1-2-2']
          },
          'municipality 1-2': {
            'city 1-2-1': ['branch 1-2-1-1', 'branch 1-2-1-2'],
            'city 1-2-2': ['branch 1-2-2-1', 'branch 1-2-2-2']
          }
        },
        'department 2': {
          'municipality 2-1': {
            'city 2-1-1': ['branch 2-1-1-1', 'branch 2-1-1-2'],
            'city 2-1-2': ['branch 2-1-2-1', 'branch 2-1-2-2']
          },
          'municipality 2-2': {
            'city 2-2-1': ['branch 2-2-1-1', 'branch 2-2-1-2'],
            'city 2-2-2': ['branch 2-2-2-1', 'branch 2-2-2-2']
          }
        }
      };
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          colombianSchoolData: expandedColombianSchoolData
        }
      };
      const wrapper = mount(<InternationalOptIn {...props} />);
      wrapper.setState({data: {schoolCountry: 'colombia'}});

      // initially, only departments are available; everything else is empty
      const departments = wrapper
        .find('select#schoolDepartment')
        .children()
        .map(option => option.prop('value'));
      expect(departments).to.eql(['', 'department 1', 'department 2']);
      expect(
        wrapper.find('select#schoolMunicipality').children()
      ).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolCity').children()).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(1);

      // after selecting a department, municipality becomes available
      wrapper.setState({
        data: {schoolDepartment: 'department 1', ...wrapper.state().data}
      });
      let municipalities = wrapper
        .find('select#schoolMunicipality')
        .children()
        .map(option => option.prop('value'));
      expect(municipalities).to.eql([
        '',
        'municipality 1-1',
        'municipality 1-2'
      ]);

      // selecting a different department will change the municipalities available
      wrapper.setState({
        data: {...wrapper.state().data, schoolDepartment: 'department 2'}
      });
      municipalities = wrapper
        .find('select#schoolMunicipality')
        .children()
        .map(option => option.prop('value'));
      expect(municipalities).to.eql([
        '',
        'municipality 2-1',
        'municipality 2-2'
      ]);

      // likewise, municipality and city selections unlock in turn
      expect(wrapper.find('select#schoolCity').children()).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(1);
      wrapper.setState({
        data: {...wrapper.state().data, schoolMunicipality: 'municipality 2-1'}
      });
      expect(wrapper.find('select#schoolCity').children()).to.have.lengthOf(3);
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(1);
      wrapper.setState({
        data: {...wrapper.state().data, schoolCity: 'city 2-1-1'}
      });
      expect(wrapper.find('select#schoolCity').children()).to.have.lengthOf(3);
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(3);
    });
  });

  describe('Chilean school interface', () => {
    it('displays school name and city as selects rather than inputs when Chile is selected', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(1);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolName')).to.have.lengthOf(0);

      wrapper.setState({
        data: {schoolCountry: 'someplace other than chile'}
      });

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(1);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolName')).to.have.lengthOf(0);

      wrapper.setState({data: {schoolCountry: 'chile'}});

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(0);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolName')).to.have.lengthOf(1);
    });

    it('displays extra inputs when Chile is selected', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolCommune')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolId')).to.have.lengthOf(0);

      wrapper.setState({
        data: {schoolCountry: 'someplace other than chile'}
      });

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolCommune')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolId')).to.have.lengthOf(0);

      wrapper.setState({data: {schoolCountry: 'chile'}});

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolCommune')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolId')).to.have.lengthOf(1);
    });

    it('requires each Chilean school data field be selected in order', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);
      wrapper.setState({data: {schoolCountry: 'chile'}});

      expect(wrapper.find('select#schoolCommune').prop('disabled')).to.be.true;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.true;
      expect(wrapper.find('select#schoolId').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolDepartment: 'department', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolCommune').prop('disabled')).to.be.false;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.true;
      expect(wrapper.find('select#schoolId').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolCommune: 'commune', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolCommune').prop('disabled')).to.be.false;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.false;
      expect(wrapper.find('select#schoolId').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolName: 'name', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolCommune').prop('disabled')).to.be.false;
      expect(wrapper.find('select#schoolName').prop('disabled')).to.be.false;
      expect(wrapper.find('select#schoolId').prop('disabled')).to.be.false;
    });

    it('populates the Chilean school data fields based on earlier selections', () => {
      const expandedChileanSchoolData = {
        'department 1': {
          'commune 1-1': {
            'name 1-1-1': ['id 1-1-1-1', 'id 1-1-1-2'],
            'name 1-1-2': ['id 1-1-2-1', 'id 1-1-2-2']
          },
          'commune 1-2': {
            'name 1-2-1': ['id 1-2-1-1', 'id 1-2-1-2'],
            'name 1-2-2': ['id 1-2-2-1', 'id 1-2-2-2']
          }
        },
        'department 2': {
          'commune 2-1': {
            'name 2-1-1': ['id 2-1-1-1', 'id 2-1-1-2'],
            'name 2-1-2': ['id 2-1-2-1', 'id 2-1-2-2']
          },
          'commune 2-2': {
            'name 2-2-1': ['id 2-2-1-1', 'id 2-2-1-2'],
            'name 2-2-2': ['id 2-2-2-1', 'id 2-2-2-2']
          }
        }
      };
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          chileanSchoolData: expandedChileanSchoolData
        }
      };
      const wrapper = mount(<InternationalOptIn {...props} />);
      wrapper.setState({data: {schoolCountry: 'chile'}});

      // initially, only departments are available; everything else is empty
      const departments = wrapper
        .find('select#schoolDepartment')
        .children()
        .map(option => option.prop('value'));
      expect(departments).to.eql(['', 'department 1', 'department 2']);
      expect(wrapper.find('select#schoolCommune').children()).to.have.lengthOf(
        1
      );
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolId').children()).to.have.lengthOf(1);

      // after selecting a department, municipality becomes available
      wrapper.setState({
        data: {schoolDepartment: 'department 1', ...wrapper.state().data}
      });
      let commune = wrapper
        .find('select#schoolCommune')
        .children()
        .map(option => option.prop('value'));
      expect(commune).to.eql(['', 'commune 1-1', 'commune 1-2']);

      // selecting a different department will change the municipalities available
      wrapper.setState({
        data: {...wrapper.state().data, schoolDepartment: 'department 2'}
      });
      commune = wrapper
        .find('select#schoolCommune')
        .children()
        .map(option => option.prop('value'));
      expect(commune).to.eql(['', 'commune 2-1', 'commune 2-2']);

      // likewise, municipality and city selections unlock in turn
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolId').children()).to.have.lengthOf(1);
      wrapper.setState({
        data: {...wrapper.state().data, schoolCommune: 'commune 2-1'}
      });
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(3);
      expect(wrapper.find('select#schoolId').children()).to.have.lengthOf(1);
      wrapper.setState({
        data: {...wrapper.state().data, schoolName: 'name 2-1-1'}
      });
      expect(wrapper.find('select#schoolName').children()).to.have.lengthOf(3);
      expect(wrapper.find('select#schoolId').children()).to.have.lengthOf(3);
    });
  });

  describe('Uzbekistan school interface', () => {
    it('displays school name and city as selects rather than inputs when Uzbekistan is selected', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(1);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(1);
      expect(wrapper.find('select#school')).to.have.lengthOf(0);

      wrapper.setState({
        data: {schoolCountry: 'someplace other than uzbekistan'}
      });

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(1);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(1);
      expect(wrapper.find('select#school')).to.have.lengthOf(0);

      wrapper.setState({data: {schoolCountry: 'uzbekistan'}});

      expect(wrapper.find('input#schoolCity')).to.have.lengthOf(0);
      expect(wrapper.find('input#schoolName')).to.have.lengthOf(0);
      expect(wrapper.find('select#school')).to.have.lengthOf(1);
    });

    it('displays extra inputs when Uzbekistan is selected', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolDistrict')).to.have.lengthOf(0);
      expect(wrapper.find('select#school')).to.have.lengthOf(0);

      wrapper.setState({
        data: {schoolCountry: 'someplace other than uzbekistan'}
      });

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(0);
      expect(wrapper.find('select#schoolDistrict')).to.have.lengthOf(0);
      expect(wrapper.find('select#school')).to.have.lengthOf(0);

      wrapper.setState({data: {schoolCountry: 'uzbekistan'}});

      expect(wrapper.find('select#schoolDepartment')).to.have.lengthOf(1);
      expect(wrapper.find('select#schoolDistrict')).to.have.lengthOf(1);
      expect(wrapper.find('select#school')).to.have.lengthOf(1);
    });

    it('requires each Uzbekistan school data field be selected in order', () => {
      const wrapper = mount(<InternationalOptIn {...defaultProps} />);
      wrapper.setState({data: {schoolCountry: 'uzbekistan'}});

      expect(wrapper.find('select#schoolDistrict').prop('disabled')).to.be.true;
      expect(wrapper.find('select#school').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolDepartment: 'department', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolDistrict').prop('disabled')).to.be
        .false;
      expect(wrapper.find('select#school').prop('disabled')).to.be.true;

      wrapper.setState({
        data: {schoolDistrict: 'district', ...wrapper.state().data}
      });

      expect(wrapper.find('select#schoolDistrict').prop('disabled')).to.be
        .false;
      expect(wrapper.find('select#school').prop('disabled')).to.be.false;
    });

    it('populates the Uzbekistan school data fields based on earlier selections', () => {
      const expandedUzbekistanSchoolData = {
        'department 1': {
          'district 1-1': ['name 1-1-1', 'name 1-1-2'],
          'district 1-2': ['name 1-2-1', 'name 1-2-2']
        },
        'department 2': {
          'district 2-1': ['name 2-1-1', 'name 2-1-2'],
          'district 2-2': ['name 2-2-1', 'name 2-2-2']
        }
      };
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          uzbekistanSchoolData: expandedUzbekistanSchoolData
        }
      };
      const wrapper = mount(<InternationalOptIn {...props} />);
      wrapper.setState({data: {schoolCountry: 'uzbekistan'}});

      // initially, only departments are available; everything else is empty
      const departments = wrapper
        .find('select#schoolDepartment')
        .children()
        .map(option => option.prop('value'));
      expect(departments).to.eql(['', 'department 1', 'department 2']);
      expect(wrapper.find('select#schoolDistrict').children()).to.have.lengthOf(
        1
      );
      expect(wrapper.find('select#school').children()).to.have.lengthOf(1);

      // after selecting a department, district becomes available
      wrapper.setState({
        data: {schoolDepartment: 'department 1', ...wrapper.state().data}
      });
      let commune = wrapper
        .find('select#schoolDistrict')
        .children()
        .map(option => option.prop('value'));
      expect(commune).to.eql(['', 'district 1-1', 'district 1-2']);

      // selecting a different department will change the districts available
      wrapper.setState({
        data: {...wrapper.state().data, schoolDepartment: 'department 2'}
      });
      commune = wrapper
        .find('select#schoolDistrict')
        .children()
        .map(option => option.prop('value'));
      expect(commune).to.eql(['', 'district 2-1', 'district 2-2']);

      // after selecting a district, school becomes available
      expect(wrapper.find('select#school').children()).to.have.lengthOf(1);
      wrapper.setState({
        data: {...wrapper.state().data, schoolDistrict: 'district 2-1'}
      });
      expect(wrapper.find('select#school').children()).to.have.lengthOf(3);
    });
  });
});
