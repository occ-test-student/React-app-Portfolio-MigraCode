import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Cards from "../../components/Cards";
import Footer from "../../components/Footer/Footer";
import "./Home.scss";
import group_photo from "../../assets/images/Screenshot_6.png";
import lessthan from "../../assets/images/lessthan.svg"
import greaterthan from "../../assets/images/greaterthan.svg";
// import photo from "../../assets/images/group_photo.jpg";
import {
  QUERY_TO_FETCH_NEXT_PAGE_PROJECTS,
  URL_PROJECTS,
  NUMBER_OF_PROJECTS_DISPLAYED,
} from "../../helpers/constants/endpoints";
import {
  URL_STUDENTS,
  QUERY_TO_FETCH_NEXT_PAGE_STUDENTS
} from "../../helpers/constants/endpoints";
import { getData } from "../../adapters/fetch";
import { useDispatch, useSelector } from "react-redux";
import {
  firstFetchedProjects,
  fetchMoreProjects,
  fetchingProjects,
  endFoFetchingProjects,
} from "../../redux/projects";
import {
  firstFetchedStudents,
  fetchMoreStudents,
  fetchingStudents,
  endFoFetchingStudents,
} from "../../redux/students";
import Loader from "../../components/Loader";
import { resetProjectsState } from "../../redux/projects";
import { Link } from "react-router-dom";



function Home() {
  // to read redux projects state
  const { projectsState } = useSelector((store) => store);

    const handleResetData = () => {
      dispatch(resetProjectsState());
    };

  // to set redux state
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  async function fetchData(fetchRequirement) {
    // queryFilterData to load more filtered data
    const { url, actionType = `` } = fetchRequirement;
    // fetchingProjects starting fetching projects // loader
    dispatch(fetchingProjects({}));
    try {
      const data = await getData(url);

      if (data) {
        // console.log(data);
        data.items.forEach((project) => {
          if (project.project_image_link.length === 0) {
            project.project_image_link =
              require("../../assets/images/default_project_img.svg").default;
          }
        });

        if (actionType === `FIRST_FETCH_DATA`) {
          // firstFetchedProjects to set first fetched projects
          dispatch(
            firstFetchedProjects({
              projects: [...data.items],
              nextPage: data.nextpage ? data.nextpage.toString() : "",
            })
          );
        } else if (actionType === `FETCH_MORE_DATA`) {
          // fetchMoreProjects to set more fetched projects
          dispatch(
            fetchMoreProjects({
              projects: [...data.items],
              nextPage: data.nextpage ? data.nextpage.toString() : "",
            })
          );
        } else {
          throw new Error(`The actionType ${actionType} is not supported`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    // endFoFetchingProjects end of fetching projects // loader
    dispatch(endFoFetchingProjects());
  }

  // first load fetch
  useEffect(() => {
    if (projectsState.projects.length === 0) {
      fetchData({
        url: `${URL_PROJECTS}`,
        actionType: "FIRST_FETCH_DATA",
      });
    }
  }, []);

  // on click load more btn
  const handleShowNextProjects = async (e) => {
    let nextIndex = currentIndex + NUMBER_OF_PROJECTS_DISPLAYED;
    // check if data already exists for next page and display it
    if (nextIndex < projectsState.projects.length) {
      setCurrentIndex(nextIndex);
    } else if (projectsState.nextPage) {
        await fetchData({
          url: `${URL_PROJECTS}?${
            QUERY_TO_FETCH_NEXT_PAGE_PROJECTS + projectsState.nextPage
          }`,
          actionType: "FETCH_MORE_DATA",
        });
        
      setCurrentIndex(nextIndex);
      }
    
  };


  const handleShowPreviousProjects = async (e) => {
    setCurrentIndex(currentIndex - NUMBER_OF_PROJECTS_DISPLAYED);
  };

  const { studentsState } = useSelector((store) => store);

  async function fetchDataStudents(fetchRequirement) {
    // queryFilterData to load more filtered data
    const { url, queryFilterData = ``, actionType = `` } = fetchRequirement;
    // fetchingStudents starting fetching students // loader
    dispatch(fetchingStudents({}));
    try {
      const data = await getData(url);

      if (data) {
        console.log(data, "students");
        data.items.forEach((student) => {
          if (student.imageUrl.length === 0) {
            student.imageUrl =
              require("../../assets/images/default_person_img.svg").default;
          }
        });
        if (actionType === `FIRST_FETCH_DATA`) {
          // firstFetchedStudents to set first fetched students (need help on the data structure)
          dispatch(
            firstFetchedStudents({
              students: [...data.items],
              offset: data.offset ? data.offset.toString() : "",
            })
          );
        } else if (actionType === `FETCH_MORE_DATA`) {
          // fetchMoreStudents to set more fetched students
          dispatch(
            fetchMoreStudents({
              students: [...data.items],
              offset: data.offset ? data.offset.toString() : "",
            })
          );
        } else {
          throw new Error(`The actionType ${actionType} is not supported`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    // endFoFetchingStudents end of fetching students // loader
    dispatch(endFoFetchingStudents());
  }

  // first load fetch
  useEffect(() => {
    if (studentsState.students.length === 0) {
      fetchDataStudents({ url: URL_STUDENTS, actionType: "FIRST_FETCH_DATA" });
    }
  }, []);

  // on click load more btn
  // const handleOnLoadMoreStudents = async (e) => {
  //   if (studentsState.offset.length === 0) {
  //     return;
  //   }

  //   await fetchDataStudents({
  //     url: `${URL_STUDENTS}?${
  //       QUERY_TO_FETCH_NEXT_PAGE_STUDENTS + studentsState.offset}`,
  //     actionType: "FETCH_MORE_DATA",
  //   });
  // };

  const handleShowNextStudents = async (e) => {
    
      console.log(studentsState, "click");
    
    let nextIndex = currentStudentIndex + NUMBER_OF_PROJECTS_DISPLAYED;
    // check if data already exists for next page and display it
    if (nextIndex < studentsState.students.length) {
      setCurrentStudentIndex(nextIndex);
    } else if (studentsState.offset) {
      await fetchDataStudents({
        url: `${URL_STUDENTS}?${
          QUERY_TO_FETCH_NEXT_PAGE_STUDENTS + studentsState.offset
        }`,
        actionType: "FETCH_MORE_DATA",
      });

      setCurrentStudentIndex(nextIndex);
    }
  };
    const handleShowPreviousStudents = async (e) => {
      setCurrentStudentIndex(
        currentStudentIndex - NUMBER_OF_PROJECTS_DISPLAYED
      );
    };




  return (
    <div className="home">
      <NavBar />
      <h1 className="main_title">MigraCode Portfolio</h1>
      <div className="main">
        <div className="description">
          <h1 className="title">Our mission</h1>
          <div className="description_text">
            <p>
              Migracode acts as a bridge between the demand for skilled people
              in the tech sector and people with a migration background who are
              eager to work in the tech industry. Founded in 2019, we are
              cooperating with other code schools in Europe to build a large
              community of companies and students to foster both labor
              integration as well as social inclusion.
            </p>
            <img src={group_photo} alt="group_photo" />
            <button className="button">Official website</button>
          </div>
        </div>
        {console.log(projectsState)}
        <div className="project_student">
          {projectsState.projects?.length > 0 && (
            <div className="projects_home">
              <Link className="title" to="/projects" onClick={handleResetData}>
                Projects made with love
              </Link>
              <div className="card_buttons">
                <div className="navigation_button">
                  {currentIndex > 0 && (
                    <button
                      className="arrow_button"
                      onClick={handleShowPreviousProjects}
                    >
                      <img src={lessthan} alt="pointer" />
                    </button>
                  )}
                </div>
                <Cards
                  allData={projectsState.projects.slice(
                    currentIndex,
                    currentIndex + NUMBER_OF_PROJECTS_DISPLAYED
                  )}
                  onClickGoTo="/project"
                />
                {/* <div className="buttons"> */}
                <div className="navigation_button">
                  {(projectsState.nextPage ||
                    currentIndex + NUMBER_OF_PROJECTS_DISPLAYED <
                      projectsState.projects.length) && (
                    <button
                      className="arrow_button"
                      onClick={handleShowNextProjects}
                    >
                      <img src={greaterthan} alt="pointer" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {studentsState.students?.length > 0 && (
            <div className="students_home">
              <Link className="title" to="/students" onClick={handleResetData}>
                Our talented students
              </Link>
              <div className="card_buttons">
                <div className="navigation_button">
                  {currentStudentIndex > 0 && (
                    <button
                      className="arrow_button"
                      onClick={handleShowPreviousStudents}
                    >
                      <img src={lessthan} alt="pointer" />
                    </button>
                  )}
                </div>
                <Cards
                  allData={studentsState.students.slice(
                    currentStudentIndex,
                    currentStudentIndex + NUMBER_OF_PROJECTS_DISPLAYED
                  )}
                  onClickGoTo="/student"
                />
                <div className="buttons">
                  <div className="navigation_button">
                    {(studentsState.offset ||
                      currentStudentIndex + NUMBER_OF_PROJECTS_DISPLAYED <
                        studentsState.students.length) && (
                      <button
                        className="arrow_button"
                        onClick={handleShowNextStudents}
                      >
                        <img src={greaterthan} alt="pointer" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;

// useEffect(() => {
//   setProjectData({
//     ...projectData,
//     projects: [
//       {
//         name: "Project 1",
//         description:
//           "Descriptioasdfasdf asdf asdf asdf asdf asdf asdf asdf weafasd fawef asdf asdf asdf asdf asdf asdf asdf asdf sdafas dfsadf asdf sadf sdn for Project 1",
//         project_image_link: require("../../assets/images/Screenshot_6.png"),
//       },
//       {
//         name: "OCCycling",
//         description:
//           "A platform to manage the free bicycle provision service given by OCC in a refugee camp in Greece to allow them to go to the city",
//         repository_link: "https://github.com/hheiress/OCCycling",
//         live_demo_link: "https://github.com",
//         project_image_link:
//           "https://666230843-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-MRebciU3NcuLgsX3ijf%2F-MVb5XncnoYEToFic_k6%2F-MVbCGfSvh7L9-UlBmjZ%2FfpTeam3.PNG?alt=media&token=7c35f842-d59d-45da-a178-c6bbc3b8993f",
//         technologies_used: [
//           "HTML",
//           "CSS",
//           "JavaScript",
//           "React.js",
//           "Database(SQL)",
//         ],
//         instructors_names: ["Nandan Rao"],
//         team_member_names: [
//           "Diana Dashkovska (TL)",
//           "José Arriaga",
//           "Anny Gómez",
//           "Gustavo Rossini",
//         ],
//         team_member_roles: [
//           "Team leader: Diana Dashkovska",
//           "Fullstack developer: Anny Gómez",
//           "Frontend developer: José Arriaga",
//           "Backend developer: Gustavo Rossini",
//           "Designer: Diana Dashkovska",
//         ],
//         trello_link: "Trello link 10",
//         product_presentation_link:
//           "https://docs.google.com/document/d/1SOLHVUsEQX-OH8T2z_OXfwbBM1-DUXOdQWbSjgCI_WM/edit#heading=h.zi8nw4t10oa6",
//       },

//     ],
//   });
// }, []);

//   const { allData } = useStudentContext();
//   const { projectData } = useProjectContext();

// console.log("Data in Home: ", allData);
// console.log("ProjectData in Home: ", projectData);

//   const filteredStudents = allData.students.slice(0, 3);
// const [projectData, setProjectData] = useState({
//   projects: [],
//   nextPage: "",
// });

// const [filteredProjectsData, setFilteredProjectsData] = useState();

// const [currentIndex, setCurrentIndex] = useState(0);
// const [isAllDataFetched, setAllDataFetched] = useState(false);

// async function fetchData(fetchRequirement) {
//   const { url } = fetchRequirement;
//   try {
//     const data = await getData(url);

// if (data) {
//   console.log("fetch", data);
//   data.items.forEach((project) => {
//     if (project.project_image_link.length === 0) {
//       project.project_image_link =
//         require("../../assets/images/default_project_img.svg").default;
//     }
//   });
//   const filterData = data.items.slice(0, 2);
//   setFilteredProjectsData(filterData);
//   setCurrentIndex(currentIndex + 2);
//   setProjectData({
//     projects: [...projectData.projects, ...data.items],
//     nextPage: data.nextpage ? data.nextpage.toString() : "",
//   });
// }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// // first load fetch
// useEffect(() => {
//   fetchData({ url: URL_PROJECTS });
// }, []);

// //  let filteredProjects = projectData.projects.slice(0, 2);
// //  console.log(filteredProjects)

// // on click load more btn
// const handleOnLoadMoreData = async (e) => {
//   console.log("button", filteredProjectsData);
//   if (currentIndex % 6 === 0 && !isAllDataFetched) {
//     await fetchData({
//       url: `${URL_PROJECTS}?${
//         QUERY_TO_FETCH_NEXT_PAGE_PROJECTS + projectData.nextPage
//       }`,
//
