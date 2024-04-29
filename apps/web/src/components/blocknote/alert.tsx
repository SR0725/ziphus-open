// import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
// import { createReactBlockSpec } from '@blocknote/react';
// import {
//   Alert as AlertComponent,
//   Menu,
//   MenuHandler,
//   MenuItem,
//   MenuList,
// } from '@/components/material-tailwind';
// import { MdCancel, MdCheckCircle, MdError, MdInfo } from 'react-icons/md';

// import { schema } from './block-note-setting';

// export const alertTypes = [
//   {
//     title: 'Warning',
//     value: 'warning',
//     icon: <MdError />,
//     color: 'amber',
//   },
//   {
//     title: 'Error',
//     value: 'error',
//     icon: <MdCancel />,
//     color: 'red',
//   },
//   {
//     title: 'Info',
//     value: 'info',
//     icon: <MdInfo />,
//     color: 'blue',
//   },
//   {
//     title: 'Success',
//     value: 'success',
//     icon: <MdCheckCircle />,
//     color: 'green',
//   },
// ] as const;

// export const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
//   title: 'Alert',
//   onItemClick: () => {
//     insertOrUpdateBlock(editor, {
//       type: 'alert',
//     });
//   },
//   aliases: ['alert', 'warning', 'error', 'info', 'success'],
//   group: 'Other',
//   icon: <MdInfo />,
// });

// export const Alert = createReactBlockSpec(
//   {
//     type: 'alert',
//     propSchema: {
//       textAlignment: defaultProps.textAlignment,
//       textColor: defaultProps.textColor,
//       type: {
//         default: 'warning',
//         values: ['warning', 'error', 'info', 'success'],
//       },
//     },
//     content: 'inline',
//   },
//   {
//     render: (props) => {
//       const alertType = alertTypes.find(
//         (type) => type.value === props.block.props.type,
//       );
//       return (
//         <AlertComponent
//           color={alertType?.color}
//           icon={
//             <Menu placement="bottom-start">
//               <MenuHandler>
//                 <span className=" cursor-pointer">{alertType?.icon}</span>
//               </MenuHandler>
//               <MenuList>
//                 {alertTypes.map((type) => (
//                   <MenuItem
//                     className=" flex items-center justify-start gap-4 bg-transparent bg-opacity-0 text-lg"
//                     key={type.value}
//                     onClick={() =>
//                       props.editor.updateBlock(props.block, {
//                         type: 'alert',
//                         props: { type: type.value },
//                       })
//                     }
//                   >
//                     <span>{type.icon}</span>
//                     <span>{type.title}</span>
//                   </MenuItem>
//                 ))}
//               </MenuList>
//             </Menu>
//           }
//           className="flex items-center gap-2"
//           style={{
//             color: props.block.props.textColor,
//             textAlign: props.block.props.textAlignment,
//           }}
//         >
//           <span ref={props.contentRef} />
//         </AlertComponent>
//       );
//     },
//   },
// );
