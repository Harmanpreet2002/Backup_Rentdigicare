import React, { useEffect, useState, useRef, useCallback } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, map } from "lodash";
import moment from "moment";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown
} from "reactstrap";
import classnames from "classnames";

import { io } from "socket.io-client";

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import * as images from "../../assets/images";
import {
  addMessage as onAddMessage,
  getChats as onGetChats,
  getContacts as onGetContacts,
  getGroups as onGetGroups,
  getMessages as onGetMessages,
} from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import axios from '../api/axios'
import jwt_decode from "jwt-decode"

const Chat = props => {
  const dispatch = useDispatch();

  const { chats, groups, contacts/*, messages*/ } = useSelector(state => ({
    chats: state.chat.chats,
    groups: state.chat.groups,
    contacts: state.chat.contacts,
    // messages: state.chat.messages,
  }));

  const [messageBox, setMessageBox] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(1);
  // eslint-disable-next-line no-unused-vars

  const [menu1, setMenu1] = useState(false);
  const [search_Menu, setsearch_Menu] = useState(false);
  const [settings_Menu, setsettings_Menu] = useState(false);
  const [other_Menu, setother_Menu] = useState(false);
  const [activeTab, setactiveTab] = useState("1");
  const [Chat_Box_Username, setChat_Box_Username] = useState("Sujidra");
  // eslint-disable-next-line no-unused-vars
  const [Chat_Box_User_Status, setChat_Box_User_Status] = useState("online");
  const [curMessage, setcurMessage] = useState("");

  const user = jwt_decode(window.localStorage.getItem("accessToken"));

  const socket = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    ...user,
    isActive: true,
  });
  const [currentConversation,setCurrentConversation]=useState(null)
  const [currentChat, setCurrentChat] = useState(null);



  useEffect(() => {
    dispatch(onGetChats());
    dispatch(onGetGroups());
    dispatch(onGetContacts());
    dispatch(onGetMessages(currentRoomId));
  }, [dispatch, currentRoomId]);


  const getConversations = async (role, id) => {
    try {
      const res = await axios.get("/conversations/" + role + "/" + id);
      console.log(res)
      if (role == "customer") {
        setConversations(res.data.managers?.[0]?.data);
      } else if (role == "manager") {
        const managerConversations = res.data.Customer?.[0]?.data.concat(res.data.Vendors);
        setConversations(managerConversations);

      } else if (role == "vendor") {
        setConversations(res.data.managers?.[0]?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const setNotification = async (data) => {
    try {
      const res = await axios.post("/conversations/notification", data);
      console.log("notification", res)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
  if(user.id)
  {
    console.log("user.id",process.env.REACT_APP_CHAT_URL,user.id)
    socket.current = io(process.env.REACT_APP_CHAT_URL);
    socket.current.emit("addUser", user.id)

   
  }   
    // socket.current.on("getMessage", (data) => {
    //   setArrivalMessage({
    //     sender: data.senderId,
    //     text: data.text,
    //     createdAt: Date.now(),
    //   });
    // });
    // socket.current.on("offline", async (data) => {
    //   console.log("Offline", data)
    //   setNotification({
    //     conversationId: data.conversationId,
    //     receiverId: data.receiverId
    //   })

    // })
    getConversations(user.role, user.id)

  }, [user.id])

  console.log("use",user.id)
  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await axios.get("/conversations/" + user.id);
  //       //setConversations(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getConversations();
  // }, [user.id]);


  // const getMessages = async () => {
  //   try {
  //     const res = await axios.post("/messages/" + currentChat?._id, { senderId: user.id });
  //     console.log("ressss", res)
  //     setMessages(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const getCurrentConversations = async () => {
    try {
      const res = await axios.post("/conversations/" + currentConversation?._id, { senderId: user.id });
      setCurrentChat(res.data);
      setMessages(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if(currentConversation?._id){
      getCurrentConversations()
    }
    // getMessages();
  }, [currentConversation]);


  useEffect(() => {

    if (arrivalMessage) {
      if (currentChat?.members.includes(arrivalMessage.sender)) {
        setMessages((prev) => [...prev, arrivalMessage])

      } else {
        conversations && conversations.map((chat, i) => {
          console.log(chat.conversation)
          chat?.conversation && console.log("newChat", chat.conversation.members, arrivalMessage.sender)
          if (chat?.conversation?.members.includes(arrivalMessage.sender)) {
            console.log("Enableddddd", arrivalMessage)
            const newConversation = [...conversations];
            newConversation[i].conversation.notification = true;



            if (!newConversation[i].conversation.message) {
              newConversation[i].conversation.message = {}
            }

            newConversation[i].conversation.message.text = arrivalMessage.text;


            setConversations(newConversation)
            setNotification({
              conversationId: newConversation[i].conversation._id,
              senderId: user.id
            })
          }
        })
      }

    }




  }, [arrivalMessage, currentChat]);


  // useEffect(() => {
  //   socket.current.emit("addUser", user.id);
  //   socket.current.on("getUsers", (users) => {
  //     // setOnlineUsers(
  //     //   user.followings.filter((f) => users.some((u) => u.userId === f))
  //     // );
  //   });
  // }, [/*user*/]);

  {
    console.log(currentChat)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(curMessage)
  try{
    const message = {
      sender: user.id,
      text: curMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat?.members?.find(
      (member) => member !== user.id
    );

    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId,
      text: curMessage,
      conversationId: currentChat._id
    });

    try {
      const res = await axios.post("/messages", message);

      setMessages([...messages, res.data]);
      setcurMessage("");
    } catch (err) {
      console.log(err);
    }
  }
  catch(e){
    console.log(e?.message);
  }
  };



  const scrollToBottom = useCallback(() => {
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight + 1000;
    }
  }, [messageBox]);

  useEffect(() => {
    if (!isEmpty(messages)) scrollToBottom();
  }, [messages, scrollToBottom]);

  // const toggleNotification = () => {
  //   setnotification_Menu(!notification_Menu)
  // }

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };

  const toggleOther = () => {
    setother_Menu(!other_Menu);
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  //Use For Chat Box
  const userChatOpen = (id, name, status, roomId) => {
    setChat_Box_Username(name);
    setCurrentRoomId(roomId);
    dispatch(onGetMessages(roomId));
  };

  const addMessage = (roomId, sender) => {
    const message = {
      id: Math.floor(Math.random() * 100),
      roomId,
      sender,
      message: curMessage,
      createdAt: new Date(),
    };
    setcurMessage("");
    dispatch(onAddMessage(message));
  };

  const onKeyPress = e => {
    const { key, value } = e;
    if (key === "Enter") {
      // setcurMessage(value);
      handleSubmit(e)
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Rentdigicare | Chat</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs  breadcrumbItem="Chat" /> */}
{/* <div className="border-bottom mb-4"/> */}
          <div className="d-flex justify-content-center">
            <Card className="chat-leftsidebar">
              <div className="p-3 px-4 border-bottom">
                <div className="d-flex align-items-start justify-content-center">
                  <div className="flex-shrink-0 me-3 align-self-center">
                    <img
                      src={images.avatar1}
                      className="avatar-sm rounded-circle"
                      alt=""
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="font-size-15 mt-0 mb-1">
                      <Link to="#" className="text-dark">
                        {user.firstname}
                      </Link>
                    </h5>
                    <p className="text-muted mb-0">
                      <i className="mdi mdi-circle text-success align-middle me-1" />
                      Active
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Dropdown
                      isOpen={menu1}
                      toggle={() => setMenu1(!menu1)}
                      className="chat-noti-dropdown"
                    >
                      <DropdownToggle tag="i" className="text-muted">
                        <i className="mdi mdi-dots-horizontal font-size-18"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem href="#">Action</DropdownItem>
                        <DropdownItem href="#">Another action</DropdownItem>
                        <DropdownItem href="#">Something else</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="search-box position-relative">
                  <input type="text" className="form-control rounded border" placeholder="Search..." />
                  <i className="bx bx-search search-icon"></i>
                </div>
              </div>

              <div className="chat-leftsidebar-nav">
                <Nav pills justified className="bg-soft-light p-1">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "1",
                      })}
                      onClick={() => {
                        toggleTab("1");
                      }}
                    >
                      <i className="bx bx-chat font-size-20 d-sm-none" />
                      <span className="d-none d-sm-block">Chat</span>
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "2",
                      })}
                      onClick={() => {
                        toggleTab("2");
                      }}
                    >
                      <i className="bx bx-group font-size-20 d-sm-none" />
                      <span className="d-none d-sm-block">Groups</span>
                    </NavLink>
                  </NavItem> */}
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "3",
                      })}
                      onClick={() => {
                        toggleTab("3");
                      }}
                    >
                      <i className="bx bx-book-content font-size-20 d-sm-none" />
                      <span className="d-none d-sm-block">Contacts</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <PerfectScrollbar style={{ height: "550px" }}>
                      <div className="pt-3">
                        <div className="px-3">
                          <h5 className="font-size-14 mb-3">Recent</h5>
                        </div>
                        <ul className="list-unstyled chat-list">
                          {conversations?.map((chat, i) => {
                            console.log(chat,"chat")
                            return (
                            <li
                              key={i}
                              className={
                                (currentChat && currentChat?._id === chat._id)
                                  ? "active"
                                  : ""
                              }
                            >
                              <Link
                                to="#"
                                onClick={() => {
                                  setChat_Box_Username(chat.name)
                                  setCurrentConversation(chat)
                             
                                  // const newConversation = [...conversations];
                                  // newConversation[i].conversation.notification = false;
                                  // setConversations(newConversation);
                                }}
                              >
                                <div className="d-flex align-items-start">
                                  <div className="align-self-center me-3">
                                    <i
                                      className={
                                        chat?.status === "online"
                                          ? "mdi mdi-circle text-success font-size-10"
                                          : chat.status === "intermediate"
                                            ? "mdi mdi-circle text-warning font-size-10"
                                            : "mdi mdi-circle font-size-10"
                                      }
                                    />
                                  </div>
                                  <div className="flex-shrink-0 user-img online align-self-center me-3">
                                    <img
                                      src={"https://i.pravatar.cc/150?img=5"}
                                      className="rounded-circle avatar-sm"
                                      alt=""
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="text-truncate font-size-14 mb-1">
                                      {chat.name}
                                    </h5>
                                    <p className="text-truncate mb-0">
                                      {chat?.conversation?.message?.text ? chat.conversation.message.text : "No messages yet"}
                                    </p>
                                  </div>
                                  <div className="font-size-11">
                                    {console.log(chat)}
                                    <div className="flex-grow-1 overflow-hidden">
                                      <h5 className="text-truncate font-size-14 mb-1">
                                        {chat?.conversation?.message?.updatedAt ? moment(chat?.conversation?.message?.updatedAt).format("h:mm") : ""}

                                      </h5>
                                      <p className="text-truncate mb-0">
                                        {chat?.conversation?.notification && chat?.conversation?.offline_user == user.id && <span style={{ background: "green", padding: "7px", borderRadius: "40px" }} class="badge badge-success">1</span>}
                                      </p>
                                    </div>

                                  </div>
                                </div>
                              </Link>
                            </li>
                          )})}
                        </ul>
                      </div>
                    </PerfectScrollbar>
                  </TabPane>

                  <TabPane tabId="2">
                    <PerfectScrollbar className="chat-message-list" style={{ height: "410px" }}>
                      <div className="pt-3">
                        <div className="px-3">
                          <h5 className="font-size-14 mb-3">Groups</h5>
                        </div>
                        <ul className="list-unstyled chat-list">
                          {groups &&
                            groups.map(group => (
                              <li key={"test" + group.image}>
                                <Link
                                  to="#"
                                  onClick={() => {
                                    userChatOpen(
                                      group.id,
                                      group.name,
                                      group.status,
                                      Math.floor(Math.random() * 100)
                                    );
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 avatar-sm me-3">
                                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {group.image}
                                      </span>
                                    </div>

                                    <div className="flex-grow-1">
                                      <h5 className="font-size-14 mb-0">
                                        {group.name}
                                      </h5>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </PerfectScrollbar>
                  </TabPane>

                  <TabPane tabId="3">
                    <PerfectScrollbar className="chat-message-list" style={{ height: "410px" }}>
                      <div className="pt-3">
                        <div className="px-3">
                          <h5 className="font-size-14 mb-3">Contacts</h5>
                        </div>

                        <div>
                          {conversations &&
                            conversations.map((conversation, i) => (
                              <div
                                key={i}
                                className={
                                  "mt-4"
                                }
                                onClick={(e) => { setCurrentChat(conversation.data.conversation) }}
                              >
                                <div>
                                  <span className="px-3 contact-list">
                                    {conversation.name}
                                  </span>
                                </div>


                              </div>
                            ))}
                        </div>
                      </div>
                    </PerfectScrollbar>
                  </TabPane>
                </TabContent>
              </div>
            </Card>
            <div className="w-100 user-chat">
         
              {currentChat &&  <Card>
                  <div className="p-4 border-bottom ">
                    <Row>
                      <Col md="4" xs="9">
                        <h5 className="font-size-15 mb-1">
                          {Chat_Box_Username}
                        </h5>

                        <p className="text-muted mb-0">
                          <i
                            className={
                              Chat_Box_User_Status === "online"
                                ? "mdi mdi-circle text-success align-middle me-1"
                                : Chat_Box_User_Status === "intermediate"
                                  ? "mdi mdi-circle text-warning align-middle me-1"
                                  : "mdi mdi-circle align-middle me-1"
                            }
                          />
                          {Chat_Box_User_Status}
                        </p>
                      </Col>
                      {/* <Col md="8" xs="3">
                        <ul className="list-inline user-chat-nav text-end mb-0">
                          <li className="list-inline-item d-none d-sm-inline-block">
                            <Dropdown
                              isOpen={search_Menu}
                              toggle={toggleSearch}
                            >
                              <DropdownToggle className="btn nav-btn" tag="i">
                                <i className="bx bx-search-alt-2" />
                              </DropdownToggle>
                              <DropdownMenu
                                className="dropdown-menu-md dropdown-menu-end"
                              >
                                <Form className="p-3">
                                  <FormGroup className="m-0">
                                    <InputGroup>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search ..."
                                        aria-label="Recipient's username"
                                      />
                                      <Button color="primary" type="submit">
                                        <i className="mdi mdi-magnify" />
                                      </Button>
                                    </InputGroup>
                                  </FormGroup>
                                </Form>
                              </DropdownMenu>
                            </Dropdown>
                          </li>
                          <li className="list-inline-item  d-none d-sm-inline-block">
                            <Dropdown
                              isOpen={settings_Menu}
                              toggle={toggleSettings}
                            >
                              <DropdownToggle className="btn nav-btn" tag="i">
                                <i className="bx bx-cog" />
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem href="#">
                                  View Profile
                                </DropdownItem>
                                <DropdownItem href="#">
                                  Clear chat
                                </DropdownItem>
                                <DropdownItem href="#">Muted</DropdownItem>
                                <DropdownItem href="#">Delete</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </li>
                          <li className="list-inline-item">
                            <Dropdown
                              isOpen={other_Menu}
                              toggle={toggleOther}
                            >
                              <DropdownToggle className="btn nav-btn" tag="i">
                                <i className="bx bx-dots-horizontal-rounded" />
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem href="#">Action</DropdownItem>
                                <DropdownItem href="#">
                                  Another Action
                                </DropdownItem>
                                <DropdownItem href="#">
                                  Something else
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </li>
                        </ul>
                      </Col> */}
                    </Row>
                  </div>

                  <div>
                    <PerfectScrollbar className="chat-conversation p-3 px-2" style={{ height: "600px" }} containerRef={ref => setMessageBox(ref)}>
                      <ul className="list-unstyled">
                        {/* <li>
                          <div className="chat-day-title">
                            <span className="title">Today</span>
                          </div>
                        </li> */}
                        {messages &&
                          map(messages, message => (
                            <li
                              key={"test_k" + message.id}
                              className={
                                message.sender === user.id
                                  ? "right"
                                  : ""
                              }
                            >
                              <div className="conversation-list">
                                <div className="ctext-wrap">
                                  <div className="ctext-wrap-content">
                                    <h5 className="conversation-name">
                                      <Link to="#" className="user-name">
                                        {message.sender === user.id ? user.firstname : Chat_Box_Username}
                                      </Link>
                                      <span className="time">
                                        {moment(message.createdAt).format(
                                          "DD-MM-YY hh:mm"
                                        )}
                                      </span>
                                    </h5>
                                    <p className="mb-0">{message.text}</p>
                                  </div>


                                  {/* <UncontrolledDropdown className="align-self-start">
                                    <DropdownToggle
                                      href="#"
                                      className="btn nav-btn"
                                      tag="i"
                                    >
                                      <i className="bx bx-dots-vertical-rounded" />
                                    </DropdownToggle>
                                    <DropdownMenu direction="right">
                                      <DropdownItem href="#">
                                        Copy
                                      </DropdownItem>
                                      <DropdownItem href="#">
                                        Save
                                      </DropdownItem>
                                      <DropdownItem href="#">
                                        Forward
                                      </DropdownItem>
                                      <DropdownItem href="#">
                                        Delete
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown> */}
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </PerfectScrollbar>
                    <div className="p-3 border-top">
                      <Row>
                        <Col>
                          <div className="position-relative">
                            <input
                              type="text"
                              value={curMessage}
                              onKeyPress={onKeyPress}
                              onChange={e => setcurMessage(e.target.value)}
                              className="form-control border bg-soft-light"
                              placeholder="Enter Message..."
                            />
                          </div>
                        </Col>
                        <Col className="col-auto">
                          <Button
                            type="button"
                            color="primary"
                            onClick={(e) =>
                              //addMessage(currentRoomId, currentUser.name)
                              handleSubmit(e)
                            }

                            className="btn btn-primary chat-send w-md"
                          >
                            <span className="d-none d-sm-inline-block me-2">
                              Send
                            </span>{" "}
                            <i className="mdi mdi-send float-end" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card>}
              
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

Chat.propTypes = {
  chats: PropTypes.array,
  groups: PropTypes.array,
  contacts: PropTypes.array,
  messages: PropTypes.array,
  onGetChats: PropTypes.func,
  onGetGroups: PropTypes.func,
  onGetContacts: PropTypes.func,
  onGetMessages: PropTypes.func,
  onAddMessage: PropTypes.func,
};

export default Chat;
