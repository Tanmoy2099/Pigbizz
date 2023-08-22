export interface PigData {
    id?: number;
    breeding_details: string;
    unique_id: string;
    tag_no: string;
    age: number;
    weight: number;
    gender: string;
    sold?: boolean;
    fathers_tagNo: string;
    mothers_tagNo: string;
    predictive_pregnancy: boolean;
    batch_no: string;
    grouping: string;
    is_ade3h_inj: boolean;
    expected_deworming_date?: Date;
    is_deworming: boolean;
    delivery_room_sentExpectedDate?: Date;
    is_deliveryRoomClean: boolean;
    expected_deliveryDate?: Date;
    expected_amoxcillin_powderDate?: Date;
    is_amoxicillin: boolean;
    expected_bitadinespray_date: Date;
    is_bitadinespray: boolean;
    actual_deliverydate: Date;
    no_ofPiglet?: number;
    no_of_male?: number;
    no_of_female?: number;
    saw_id?: number;
    boar_id?: number;
    first_heatDate?: Date;
    second_heatDate?: Date;
    third_heatDate?: Date;
    first_crossingDate: Date;
    is_rechockAfterFirstCrossingDate: boolean;
    second_crossingDate?: Date;
    expected_1stade3hInjDate?: Date;
    is_1stAde3h: boolean;
    expected_2ndade3hInjDate?: Date;
    date_of_lic_startedDate?: Date;
    is_2ndAde3h: boolean;
}



//--------------- Required field ----------------------
// breeding_details: string;
// unique_id: string;
// tag_no: string;
// age: number;
// weight: number;
// gender: string;
// fathers_tagNo: string;
// mothers_tagNo: string;
// predictive_pregnancy: boolean;
// batch_no: string;
// grouping: string;
// is_ade3h_inj: boolean;
// is_deworming: boolean;
// is_deliveryRoomClean: boolean;
// is_amoxicillin: boolean;
// expected_bitadinespray_date: Date;
// is_bitadinespray: boolean;
// actual_deliverydate: Date;
// first_crossingDate: Date;
// is_rechockAfterFirstCrossingDate: boolean;
// is_1stAde3h: boolean;
// is_2ndAde3h: boolean;


// ------------ optional ----------------------
    // expected_deworming_date?: Date;
    // delivery_room_sentExpectedDate?: Date;
    // expected_deliveryDate?: Date;
    // expected_amoxcillin_powderDate?: Date;
    // no_ofPiglet?: number;
    // no_of_male?: number;
    // no_of_female?: number;
    // saw_id?: number;
    // boar_id?: number;
    // first_heatDate?: Date;
    // second_heatDate?: Date;
    // third_heatDate?: Date;
    // second_crossingDate?: Date;
    // expected_1stade3hInjDate?: Date;
    // expected_2ndade3hInjDate?: Date;
    // date_of_lic_startedDate?: Date;