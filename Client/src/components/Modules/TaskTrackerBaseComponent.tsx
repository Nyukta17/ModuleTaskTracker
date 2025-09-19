import { useState } from "react"
import { Tabs,Tab } from "react-bootstrap";
import Tasks from "./ElementTasksBase/Tasks";
import Kamban from "./ElementTasksBase/Kamban";
import MyTasks from "./ElementTasksBase/MyTasks";


const TaskTrackerBaseComponent:React.FC = ()=>{
    const [activeKey,setActiveKey]  =useState("tasks");
    return(<>
        <Tabs
        activeKey={activeKey}
        onSelect={(k)=>k&&setActiveKey(k)}
        className="md-3"
        id="Tasks_module"
        >
            <Tab eventKey="tasks" title="Tasks">
                <div style={{ padding: 20, minHeight: 200 }}><Tasks/></div>
            </Tab>
            <Tab eventKey="timeBoard" title="Kamban">
                <div style={{ padding: 20, minHeight: 200 }}>
                    <Kamban/>
                </div>
            </Tab>
            <Tab eventKey="prioritiTasks" title="Мои задачи">
                <div style={{ padding: 20, minHeight: 200 }}>
                    <MyTasks/>
                </div>
            </Tab>
        </Tabs>
    </>)
}
export default TaskTrackerBaseComponent