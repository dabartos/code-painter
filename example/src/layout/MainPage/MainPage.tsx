import React, {FC} from "react";
import {ExampleBox, ExampleBoxItem} from "../../components";

const MainPage: FC = () => {
    return (
        <div>
            <ExampleBox defaultExpanded>
                <ExampleBoxItem label={`
                    <Container><HiComp>Hi</HiComp>
                        <DemoLabel id="demo-label-example">Test</DemoLabel>
                        <CComponent comp={<D/>}>
                            asd{"<"}asd
                            <NestedE f={ <F> </F>}>
                                gfgfg
                                <SuperInnerG/>
                                <SuperInnerG {...props} />
                                <div>
                                    Lol
                                </div>
                            </NestedE> <E f={ <F> </F>} />
                            <C comp={<D/>} />
                            asd{"<"}asd
                        </CComponent>
                        !ioasdghb
                    </Container>
                `} />
                <ExampleBoxItem label={`
                    <FormControl>
                        <InputLabel id="demo-label-example">Test</InputLabel>
                        <Select
                            labelId="demo-label-example"
                            id="select-id-example"
                            value={value}
                            onChange={(event: React.ChangeEvent<{ value: number }>) => setValue(event.target.value as string)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                `} />
            </ExampleBox>
        </div>
    );
};

export default MainPage;
