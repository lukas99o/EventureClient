import { useState, useEffect, useRef } from 'react'
import { GetFriends } from '../api/friends/getFriends'
import { GetFriendRequests } from '../api/friends/getFriendsRequests'
import { SendFriendRequest } from '../api/friends/sendFriendRequest'
import { AcceptFriendRequest } from '../api/friends/acceptFriendRequest'
import { DeclineFriendRequest } from '../api/friends/declineFriendRequest'
import { RegretFriendRequest } from '../api/friends/regretFriendRequest'
import { RemoveFriend } from '../api/friends/removeFriend'
import { GetConversations } from '../api/conversations/getConversations'
import { StartPrivateConversation } from '../api/conversations/startPrivateConversation'
import type { FriendDto, FriendRequestDto, ConversationDto } from '../types'
import { calculateAge } from '../utils/calculateAge'
import PrivateChat from '../components/PrivateChat'
import { API_BASE_URL } from '../config'
import FriendProfile from '../components/FriendProfile'

export default function Friends() {
  const [friends, setFriends] = useState<FriendDto[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequestDto>({
    incomingUsernames: [],
    outgoingUsernames: [],
  })
  const [loadingFriends, setLoadingFriends] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [friendRequestMessage, setFriendRequestMessage] = useState<string | null>(null)
  const [friendRequestUsername, setFriendRequestUsername] = useState<string>("")
  const [width, setWidth] = useState<number>(document.body.clientWidth)
  const [activeView, setActiveView] = useState<boolean>(true)
  const [friendSearch, setFriendSearch] = useState<string>("")
  const [filteredFriends, setFilteredFriends] = useState<FriendDto[]>([])
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null)
  const [chatStarted, setChatStarted] = useState<boolean>(false)
  const [conversations, setConversations] = useState<ConversationDto[]>([])
  const [conversation, setConversation] = useState<ConversationDto | null>(null)
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const userId = localStorage.getItem("userId") || ""

  const sendFriendRequest = async (username: string) => {
    if (friendRequests.incomingUsernames.includes(username) || friendRequests.outgoingUsernames.includes(username)) {
      alert("You or the recipient has already sent a friend request")
      return
    }

    const success = await SendFriendRequest(username)
    if (success) {
      setFriendRequestMessage("Friend request sent!")
      setLoadingRequests(true)
      const requestsData = await GetFriendRequests()
      setFriendRequests(requestsData)
      setLoadingRequests(false)
    } else {
      setFriendRequestMessage("Failed: invalid username.")
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setFriendRequestMessage(null), 4000)
  }

  const acceptFriendRequest = async (username: string) => {
    const success = await AcceptFriendRequest(username)
    if (success) {
      friendRequests.incomingUsernames = friendRequests.incomingUsernames.filter(u => u !== username)
      setFriendRequests({ ...friendRequests })
      setLoadingFriends(true)
      const friendsData = await GetFriends()
      setFriends(friendsData)
      setFilteredFriends(friendsData)
      setLoadingFriends(false)
    } else alert("Failed to accept friend request.")
  }

  const declineFriendRequest = async (username: string) => {
    const success = await DeclineFriendRequest(username)
    if (success) {
      friendRequests.incomingUsernames = friendRequests.incomingUsernames.filter(u => u !== username)
      setFriendRequests({ ...friendRequests })
    } else alert("Failed to decline friend request.")
  }

  const regretFriendRequest = async (username: string) => {
    const success = await RegretFriendRequest(username)
    if (success) {
      friendRequests.outgoingUsernames = friendRequests.outgoingUsernames.filter(u => u !== username)
      setFriendRequests({ ...friendRequests })
    } else alert("Failed to cancel friend request.")
  }

  const removeFriend = async (friend: FriendDto) => {
    const confirmed = window.confirm(`Do you want to remove ${friend.username} as a friend?`)
    if (!confirmed) return

    const success = await RemoveFriend(friend.username)
    if (success) {
      const updatedFriends = friends.filter(f => f.userId !== friend.userId)
      setFriends(updatedFriends)
      setFilteredFriends(prev => prev.filter(f => f.userId !== friend.userId))

      if (selectedFriendId === friend.userId) {
        setSelectedFriendId(null)
      }

      if (selectedChatUser === friend.username) {
        setSelectedChatUser(null)
        setChatStarted(false)
        setConversation(null)
      }
    } else {
      alert("Failed to remove friend.")
    }
  }

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await GetFriends()
      setFriends(friendsData)
      setFilteredFriends(friendsData)
      setLoadingFriends(false)
    }

    const fetchFriendRequests = async () => {
      const requestsData = await GetFriendRequests()
      setFriendRequests(requestsData)
      setLoadingRequests(false)
    }

    const fetchConversations = async () => {
      const conversationsData = await GetConversations()
      setConversations(conversationsData)
    }

    fetchFriends()
    fetchFriendRequests()
    fetchConversations()
  }, [])

  useEffect(() => {
    const handleResize = () => setWidth(document.body.clientWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (friendSearch.trim() === "") setFilteredFriends(friends)
      else setFilteredFriends(friends.filter(f => f.username.toLowerCase().includes(friendSearch.toLowerCase())))
    }, 200)
    return () => clearTimeout(timeout)
  }, [friendSearch, friends])

  const handleFriendRequestKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendFriendRequest(friendRequestUsername)
    }
  }

  const isMobileCompactView = width < 768

  return (
    <div className="container d-flex flex-column" style={{ height: "65vh" }}>
      <div className="d-flex gap-4 flex-grow-1" style={{ overflowY: "hidden" }}>
        {(width > 968 || (activeView && width < 968)) && (
          <div className="bg-light rounded shadow p-3 d-flex flex-column container-header" style={{ width: width > 968 ? "50%" : "100%" }}>
            
            {selectedChatUser && width < 968 ? (
              <div className="flex-grow-1 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="header mb-0">{selectedChatUser}</h3>
                  <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2" onClick={() => setSelectedChatUser(null)}>← Back</button>
                </div>

                {chatStarted && (
                  <div className="bg-white border rounded p-3 shadow-sm flex-grow-1 d-flex flex-column" style={{ height: "400px" }}>
                    <PrivateChat
                      conversationId={conversation?.conversationId}
                      senderId={userId}
                    />
                  </div>
                )}
              </div>
            ) : selectedFriendId && width < 968 ? (
              <div className="flex-grow-1 d-flex flex-column overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="header mb-0">Profile</h3>
                  <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2" onClick={() => setSelectedFriendId(null)}>← Back</button>
                </div>
                <FriendProfile userId={selectedFriendId} />
              </div>
            ) : (
                <> 
                    {width < 968 ? (
                        <div className="d-flex justify-content-around align-items-center">
                            <h3 className="mb-3 header text-center mt-1 mb-3">My Friends</h3>
                            <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2 mb-3" onClick={() => setActiveView(false)}>Find Friends</button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="mb-3 header text-center mt-1 mb-3">My Friends</h2>
                        </div>
                    )}
                    
                    {loadingFriends ? (
                        <p>Loading friends...</p>
                    ) : friends.length > 0 ? (
                    <>
                    <div>
                        <div className="border rounded p-3 mb-4 bg-white shadow-sm" style={{ flexShrink: 0 }}>
                            <label className="form-label fw-bold">Search for a friend:</label>
                            <div className="input-group gap-2">
                                <input
                                className="form-control"
                                type="text"
                              placeholder="Username..."
                                value={friendSearch}
                                onChange={(e) => setFriendSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`flex-grow-1 overflow-auto border rounded shadow-sm ${isMobileCompactView ? "p-2" : "p-3"}`}>
                        {filteredFriends.map(friend => (
                      <div key={friend.username} className={`border rounded bg-white shadow-sm d-flex justify-content-between align-items-md-center flex-column flex-md-row ${isMobileCompactView ? "p-2 mb-2" : "p-3 mb-3"}`}>
                        <div className={`d-flex align-items-center ${isMobileCompactView ? "gap-2" : "gap-3"}`}>
                            <div className="bg-secondary rounded-circle d-flex justify-content-center align-items-center" 
                          style={{ width: isMobileCompactView ? "64px" : "100px", height: isMobileCompactView ? "64px" : "100px" }}>{friend.profilePicturePath ? <img src={`${API_BASE_URL}${friend.profilePicturePath}`} 
                              alt="Profile picture" 
                          className="rounded-circle" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="text-white" style={{ fontSize: isMobileCompactView ? 30 : 48 }}>👤</span>}</div>
                            <div>
                          <h5 className={`mb-1 ${isMobileCompactView ? "fs-6" : ""}`}>{friend.username}</h5>
                          <p className={`mb-0 text-muted ${isMobileCompactView ? "small" : ""}`}>{friend.name}, {calculateAge(friend.age)} years</p>
                            </div>
                            </div>
                        <div className={`d-flex mt-2 mt-md-0 justify-content-end justify-content-md-start flex-md-column ${isMobileCompactView ? "gap-1" : "gap-2"}`}>
                          <button className={`btn-orange ${isMobileCompactView ? "px-2 py-1 btn-sm" : "px-2 px-lg-4 py-1 py-lg-2"}`}
                                    onClick={() => {
                                        setSelectedFriendId(friend.userId)
                                        setSelectedChatUser(null)
                                        setChatStarted(false)
                                    }}
                                >
                                  Profile
                                </button>
                          <button className={`btn-orange ${isMobileCompactView ? "px-2 py-1 btn-sm" : "px-2 px-lg-4 py-1 py-lg-2"}`}
                                    onClick={async () => {
                                    setSelectedFriendId(null)
                                    setChatStarted(false);
                                    setSelectedChatUser(friend.username)
                                    const conversation = await StartPrivateConversation(friend.username)
                                    if (conversation) {
                                        if (!conversations.some(c => c.conversationId === conversation.conversationId)) {
                                        setConversations(prev => [...prev, conversation])
                                        }
                                        setConversation(conversation)
                                        setChatStarted(true)
                                    } else {
                                        alert("Could not start a chat with this user.")
                                        setChatStarted(false)
                                    }
                                    }}
                                >
                                    Chat
                                </button>
                              <button className={`btn btn-outline-danger ${isMobileCompactView ? "px-2 py-1 btn-sm" : "px-2 px-lg-4 py-1 py-lg-2"}`}
                                onClick={() => removeFriend(friend)}
                              >
                                Remove friend
                              </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    </>
                    ) : (
                    <div className="p-3 border rounded">
                        <p className="mb-2 text-center"><strong>No friends to show</strong></p>
                        <p className="text-muted">Add friends by sending friend requests or joining events.</p>
                    </div>
                    )}
                 </>
                )}
          </div>
        )}

        {(width > 968 || (!activeView && width < 968)) && (
          <div className="bg-light rounded shadow p-3 d-flex flex-column container-header" style={{ width: width > 968 ? "50%" : "100%" }}>
            {selectedChatUser && width > 968 ? (
              <div className="flex-grow-1 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="header mb-0">{selectedChatUser}</h3>
                  <button className="btn-orange" onClick={() => setSelectedChatUser(null)}>← Back</button>
                </div>

                {chatStarted && (
                  <div className="bg-white border rounded p-3 shadow-sm flex-grow-1 d-flex flex-column" style={{ height: "300px" }} >
                    <PrivateChat
                      conversationId={conversation?.conversationId}
                      senderId={userId}
                    />
                  </div>
                 )}
            </div>
            ) :  selectedFriendId ? (
                  <div className="flex-grow-1 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="header mb-0">Profile</h3>
                      <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2" onClick={() => setSelectedFriendId(null)}>← Back</button>
                    </div>
                    <div className="mt-5">
                      <FriendProfile userId={selectedFriendId} />
                    </div>
                  </div>
              ) : (
              <>
                {width < 968 ? (
                        <div className="d-flex justify-content-around align-items-center">
                      <h3 className="mb-3 header text-center mt-1 mb-3">Friend requests</h3>
                            <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2 mb-3" onClick={() => setActiveView(true)}>Friends</button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="mb-3 header text-center mt-1 mb-3">Friend requests</h2>
                        </div>
                )}

                <div className="border rounded p-3 mb-4 bg-white shadow-sm" style={{ flexShrink: 0 }}>
                  <label className="form-label fw-bold">Send friend request:</label>
                  <div className="input-group gap-2">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Username..."
                      value={friendRequestUsername}
                      onChange={(e) => setFriendRequestUsername(e.target.value)}
                      onKeyDown={handleFriendRequestKeyDown}
                    />
                    <button className="btn-orange px-2 py-1" onClick={() => sendFriendRequest(friendRequestUsername)}>Send</button>
                  </div>
                  {friendRequestMessage && (
                    <div className="alert alert-info mt-2 d-flex justify-content-between align-items-center">
                      {friendRequestMessage}
                    </div>
                  )}
                </div>

                <div className="flex-grow-1 overflow-auto border rounded p-3 shadow-sm">
                  {loadingRequests ? (
                    <p>Loading friend requests...</p>
                  ) : (friendRequests.incomingUsernames?.length || friendRequests.outgoingUsernames?.length) ? (
                    <>
                      {friendRequests.incomingUsernames?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-success">Incoming requests:</h6>
                          {friendRequests.incomingUsernames.map(username => (
                            <div key={username} className="border rounded p-2 mb-2 bg-white d-flex justify-content-between align-items-center shadow-sm">
                              <span>{username}</span>
                              <div className="d-flex gap-1">
                                <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2 fs-6" onClick={() => acceptFriendRequest(username)} style={{ width: "fit-content"}}>Accept</button>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => declineFriendRequest(username)}>Decline</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {friendRequests.outgoingUsernames?.length > 0 && (
                        <div>
                          <h6 className="text-warning">Sent requests:</h6>
                          {friendRequests.outgoingUsernames.map(username => (
                            <div key={username} className="border rounded p-2 mb-2 bg-white d-flex justify-content-between align-items-center shadow-sm">
                              <span>{username}</span>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => regretFriendRequest(username)}>Cancel</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-4 border rounded">
                      <p className="text-muted"><strong>No friend requests to show</strong></p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
