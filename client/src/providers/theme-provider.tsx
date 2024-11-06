import React from 'react'
import { ConfigProvider } from 'antd';

function ThemeProvider({children} : {children: React.ReactNode}) {
  return (
    <ConfigProvider
    theme={
        {
            token : {
                colorPrimary : '#4B0082', 
                borderRadius : 2,
                controlOutline : 'none',
            },
            components : {
                Button : {
                    controlHeight : 45,
                },
                Input : {
                    controlHeight : 45,
                },
                Select : {
                    controlHeight : 45,
                },
                InputNumber : {
                    controlHeight : 45,
                }
            }
        }
    }
    >
        {children}
    </ConfigProvider>
  )
}

export default ThemeProvider